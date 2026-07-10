const FEISHU_TOKEN_URL = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal'

const requiredEnv = [
  'FEISHU_APP_ID',
  'FEISHU_APP_SECRET',
  'FEISHU_ANALYTICS_BITABLE_APP_TOKEN',
  'FEISHU_ANALYTICS_BITABLE_TABLE_ID',
]

function json(response, status, payload) {
  response.status(status).json(payload)
}

function cleanString(value, maxLength = 2000) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function readBody(request) {
  if (!request.body) return {}
  if (typeof request.body === 'object' && !Buffer.isBuffer(request.body)) return request.body
  const raw = Buffer.isBuffer(request.body) ? request.body.toString('utf8') : String(request.body)
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function getTenantAccessToken() {
  const response = await fetch(FEISHU_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    }),
  })
  const payload = await response.json()
  if (!response.ok || payload.code !== 0 || !payload.tenant_access_token) {
    throw new Error(`Feishu token failed: ${payload.msg || response.status}`)
  }
  return payload.tenant_access_token
}

async function createEventRecord(fields) {
  const tenantToken = await getTenantAccessToken()
  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_ANALYTICS_BITABLE_APP_TOKEN}/tables/${process.env.FEISHU_ANALYTICS_BITABLE_TABLE_ID}/records`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${tenantToken}`,
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ fields }),
  })
  const payload = await response.json()
  if (!response.ok || payload.code !== 0) {
    throw new Error(`Feishu record failed: ${payload.msg || response.status}`)
  }
  return payload.data?.record?.record_id
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return json(response, 405, { ok: false, error: 'Method not allowed' })
  }

  const missingEnv = requiredEnv.filter((key) => !process.env[key])
  if (missingEnv.length > 0) {
    return json(response, 202, { ok: false })
  }

  try {
    const body = readBody(request)
    const props = body.props && typeof body.props === 'object' ? body.props : {}
    const event = cleanString(body.event, 120)
    if (!event) {
      return json(response, 400, { ok: false, error: 'Missing event.' })
    }

    const fields = {
      Event: event,
      Timestamp: Date.now(),
      Path: cleanString(props.path, 500) || '-',
      Section: cleanString(props.section, 120) || '-',
      Label: cleanString(props.label, 160) || '-',
      'UTM Source': cleanString(props.utm_source, 120) || '-',
      'UTM Medium': cleanString(props.utm_medium, 120) || '-',
      'UTM Campaign': cleanString(props.utm_campaign, 160) || '-',
      'Session ID': cleanString(body.sessionId, 120) || '-',
      'User Agent': cleanString(request.headers['user-agent'], 500) || '-',
      Payload: JSON.stringify(props).slice(0, 5000),
    }
    const recordId = await createEventRecord(fields)
    return json(response, 200, { ok: true, recordId })
  } catch (error) {
    console.error(error)
    return json(response, 202, { ok: false })
  }
}
