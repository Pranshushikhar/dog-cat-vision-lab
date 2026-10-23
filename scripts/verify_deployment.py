import re
import requests

def main():
    print("Fetching Cloudflare Pages HTML...")
    res = requests.get("https://pawvision-ai.pages.dev", timeout=15)
    print("Status code:", res.status_code)
    
    js_files = re.findall(r'src="(/assets/[^"]+\.js)"', res.text)
    print("Found JS files:", js_files)
    
    found_render = False
    found_trycloudflare = False
    
    for js_path in js_files:
        js_url = f"https://pawvision-ai.pages.dev{js_path}"
        content = requests.get(js_url, timeout=15).text
        if "pawvision-ai-backend.onrender.com" in content:
            print(f"[SUCCESS] Found Render URL in: {js_path}")
            found_render = True
        if "trycloudflare" in content:
            print(f"[WARNING] Found trycloudflare in: {js_path}")
            found_trycloudflare = True
            
    print("\nSummary:")
    print("Render URL embedded in production bundle:", found_render)
    print("Expired trycloudflare present in bundle:", found_trycloudflare)
    assert found_render, "Render URL not found in production bundle!"
    assert not found_trycloudflare, "Expired trycloudflare found in production bundle!"
    print("\nProduction Cloudflare Pages configuration verified 100%!")

if __name__ == "__main__":
    main()
