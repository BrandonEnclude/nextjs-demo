export async function getAuth(authCode) {
  const formData = {
    grant_type: 'authorization_code',
    code: authCode,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI
  }
  const res = await fetch('https://login.salesforce.com/services/oauth2/token', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: urlEncodeForm(formData)
  })
  if (res.status !== 200) return null
  return await res.json()
}
  
export async function getUser(access_token) {
  const res = await fetch(`${process.env.SF_URL}/${process.env.COMMUNITY_SITE}/services/oauth2/userinfo`, {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}

export async function getSObject(access_token, sObjectType, id) {
  const res = await fetch(`${process.env.SF_URL}/services/data/v48.0/sobjects/${sObjectType}/${id}`, {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}

export async function getAdminToken() {
  const formData = {
    grant_type: 'password',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.ADMIN_USERNAME,
    password: `${process.env.ADMIN_PASSWORD}${process.env.ADMIN_SECRET_TOKEN}`
  }
  const res = await fetch(`https://login.salesforce.com/services/oauth2/token`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: urlEncodeForm(formData)
  })
  return await res.json()
}

export async function updateWallet(access_token, email, amount) {
  const getRes = await fetch(`${process.env.SF_URL}/services/data/v48.0/query?q=SELECT+Id,Wallet_Amount__c+FROM+User+WHERE+Email='${email}'&limit=1`, {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    }
  })
  const userDetailsRes = await getRes.json()
  const userDetails = userDetailsRes.records[0]

  const patchRes = await fetch(`${process.env.SF_URL}/services/data/v48.0/sobjects/User/${userDetails.Id}`, {
    method: 'patch',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({Wallet_Amount__c: userDetails.Wallet_Amount__c + amount})
  })
  return patchRes
}

export function urlEncodeForm(formData) {
  const formBody = []
  for (let property in formData) {
    let encodedKey = encodeURIComponent(property)
    let encodedValue = encodeURIComponent(formData[property])
    formBody.push(`${encodedKey}=${encodedValue}`)
  }
  return formBody.join('&')
}
