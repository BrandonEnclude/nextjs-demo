import Head from 'next/head'

export default function Home() {
  const clientId = '3MVG95G8WxiwV5Ptib1Zg_oPWxuJAgNilF16FmayvE8pOKjifuU76CwnwjBI0zpFGSFP2c6KmmOTfJtjBulGs'
  const redirectUri = 'http://localhost:3000/callback'
  const loginUrl = `https://bd1887-developer-edition.eu32.force.com/nextdemo/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
  
  return (
    <>
      <Head>
        <title>Next Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Next Demo</h1>
      <a href={loginUrl} className="button">Log in</a>
    </>
  )
}