# [SECURITY: Cloudflare Turnstile] — Validates human tokens to stop spam bots on public wish forms
import os
import httpx
from typing import Optional

TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY", "").strip()
TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

# Cloudflare official testing keys:
# Sitekey: 1x00000000000000000000AA (always passes)
# Secret: 1x0000000000000000000000000000000AA (always passes)
TEST_SECRET_KEY = "1x0000000000000000000000000000000AA"

async def verify_turnstile_token(token: Optional[str], remote_ip: Optional[str] = None) -> bool:
    """
    Verifies Cloudflare Turnstile token.
    Graceful mode: If secret key is not configured, or set to test key, validation succeeds.
    """
    secret = TURNSTILE_SECRET_KEY or TEST_SECRET_KEY

    # If in dev / test mode without real secret key, allow test tokens or bypass gracefully
    if not TURNSTILE_SECRET_KEY or TURNSTILE_SECRET_KEY == TEST_SECRET_KEY:
        return True

    if not token:
        print("[Turnstile Warning] Missing turnstile token on public submission")
        return False

    try:
        data = {
            "secret": secret,
            "response": token
        }
        if remote_ip:
            data["remoteip"] = remote_ip

        async with httpx.AsyncClient(timeout=3.5) as client:
            resp = await client.post(TURNSTILE_VERIFY_URL, data=data)
            if resp.status_code == 200:
                result = resp.json()
                success = result.get("success", False)
                if not success:
                    print(f"[Turnstile Warning] Verification rejected: {result.get("error-codes")}")
                return success
            return False
    except Exception as e:
        print(f"[Turnstile Error] Connection to Cloudflare failed: {e}. Gracefully allowing submission.")
        # Graceful fallback so a Cloudflare glitch does not ruin stage celebration
        return True
