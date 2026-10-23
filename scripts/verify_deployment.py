import re
import requests

def main():
    print("Fetching Cloudflare Pages HTML from https://pawvision-ai.pages.dev ...")
    res = requests.get("https://pawvision-ai.pages.dev", timeout=15)
    print("HTML Status Code:", res.status_code)
    assert res.status_code == 200, "Failed to load live website"
    
    js_files = re.findall(r'src="(/assets/[^"]+\.js)"', res.text)
    css_files = re.findall(r'href="(/assets/[^"]+\.css)"', res.text)
    print("Found JS files:", js_files)
    print("Found CSS files:", css_files)
    
    found_render = False
    found_trycloudflare = False
    found_team_credit = False
    
    for js_path in js_files:
        js_url = f"https://pawvision-ai.pages.dev{js_path}"
        content = requests.get(js_url, timeout=15).text
        if "pawvision-ai-backend.onrender.com" in content:
            print(f"[SUCCESS] Found Render backend URL in: {js_path}")
            found_render = True
        if "trycloudflare" in content:
            print(f"[WARNING] Found trycloudflare in: {js_path}")
            found_trycloudflare = True
        if "Pranshu Shikhar" in content and "Rishabh Vaish" in content and "Ankit Raj" in content:
            print(f"[SUCCESS] Found team credit line in: {js_path}")
            found_team_credit = True

    found_team_css = False
    for css_path in css_files:
        css_url = f"https://pawvision-ai.pages.dev{css_path}"
        content = requests.get(css_url, timeout=15).text
        if "navbar-team-credit" in content:
            print(f"[SUCCESS] Found navbar-team-credit styling in: {css_path}")
            found_team_css = True
            
    print("\n================ Verification Summary ================")
    print("1. Render Backend URL active:", found_render)
    print("2. Expired trycloudflare absent:", not found_trycloudflare)
    print("3. Team Credit line in live bundle:", found_team_credit)
    print("4. Team Credit responsive CSS active:", found_team_css)
    
    assert found_render, "Render URL not found in production bundle!"
    assert not found_trycloudflare, "Expired trycloudflare found in production bundle!"
    assert found_team_credit, "Team credit line not found in live production bundle!"
    assert found_team_css, "Team credit styling not found in live production bundle!"
    print("\nALL LIVE PRODUCTION ASSETS VERIFIED 100%!")

if __name__ == "__main__":
    main()
