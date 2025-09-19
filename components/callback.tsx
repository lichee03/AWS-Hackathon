"use client"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const fetchTokens = async () => {
      const code = router.query.code as string
      if (!code) return

      const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
      const clientSecret = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET // optional
      const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!
      const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
      })

      const headers: Record<string, string> = {
        "Content-Type": "application/x-www-form-urlencoded",
      }

      if (clientSecret) {
        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
        headers["Authorization"] = `Basic ${authString}`
      }

      const res = await fetch(`${cognitoDomain}/oauth2/token`, {
        method: "POST",
        headers,
        body: body.toString(),
      })

      const tokens = await res.json()
      console.log("Cognito tokens:", tokens)

      localStorage.setItem("fmcg-tokens", JSON.stringify(tokens))

      router.push("/")
    }

    if (router.isReady) fetchTokens()
  }, [router])

  return <div>Processing login...</div>
}
