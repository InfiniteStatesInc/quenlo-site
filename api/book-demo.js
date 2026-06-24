const FEISHU_TOKEN_URL = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal'

const requiredEnv = [
  'FEISHU_APP_ID',
  'FEISHU_APP_SECRET',
  'FEISHU_BITABLE_APP_TOKEN',
  'FEISHU_BITABLE_TABLE_ID',
]

function json(response, status, payload) {
  response.status(status).json(payload)
}

function cleanString(value, maxLength = 2000) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
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

async function createLeadRecord(fields) {
  const tenantToken = await getTenantAccessToken()
  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_BITABLE_APP_TOKEN}/tables/${process.env.FEISHU_BITABLE_TABLE_ID}/records`
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
    return json(response, 500, { ok: false, error: 'Lead capture is not configured.' })
  }

  const body = request.body || {}
  const name = cleanString(body.name, 120)
  const email = cleanString(body.email, 160).toLowerCase()
  const company = cleanString(body.company, 160)
  const role = cleanString(body.role, 160)
  const teamSize = cleanString(body.teamSize, 80)
  const timeline = cleanString(body.timeline, 80)
  const meetingFlow = cleanString(body.meetingFlow, 2000)
  const pageUrl = cleanString(body.pageUrl, 500)
  const userAgent = cleanString(request.headers['user-agent'], 500)

  if (!name || !email || !company || !teamSize || !timeline) {
    return json(response, 400, { ok: false, error: 'Missing required fields.' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(response, 400, { ok: false, error: 'Please enter a valid work email.' })
  }

  try {
    const recordId = await createLeadRecord({
      Name: name,
      'Submitted At': new Date().toISOString(),
      'Work Email': email,
      Company: company,
      Role: role || '-',
      'Team Size': teamSize,
      'Demo Timing': timeline,
      'Meeting Flow To Test': meetingFlow || '-',
      Source: 'quenlo-landing-page',
      'Page URL': pageUrl || '-',
      'User Agent': userAgent || '-',
      Status: 'new',
    })
    return json(response, 200, { ok: true, recordId })
  } catch (error) {
    console.error(error)
    return json(response, 502, { ok: false, error: 'Could not save the request. Please try again.' })
  }
}
