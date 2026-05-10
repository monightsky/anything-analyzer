import { readFileSync } from "fs";
import type { CaManager } from "./ca-manager";

/** Magic hostname that triggers the cert download page */
export const CERT_DOWNLOAD_HOST = "cert.anything.test";
export const CERT_DOWNLOAD_FALLBACK_HOST = "cert.anything.local";

export function isCertDownloadHost(host: string): boolean {
  const normalized = host.trim().toLowerCase().replace(/\.$/, "");
  return normalized === CERT_DOWNLOAD_HOST || normalized === CERT_DOWNLOAD_FALLBACK_HOST;
}

/**
 * Detect platform from User-Agent string.
 */
function detectPlatform(ua: string): "ios" | "android" | "desktop" {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

/**
 * Generate the HTML certificate download page.
 * @param ua User-Agent string for platform detection
 * @param overrideHost Optional host (ip:port or hostname:port) to use for the download link.
 *                     When a LAN device accesses the proxy directly by IP, this ensures the
 *                     download link points back to the same accessible address.
 */
export function generateCertPage(ua: string, overrideHost?: string): string {
  const platform = detectPlatform(ua);
  const defaultHost = platform === "ios" ? CERT_DOWNLOAD_HOST : CERT_DOWNLOAD_FALLBACK_HOST;
  const downloadHost = overrideHost || defaultHost;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Anything Analyzer - 安装 CA 证书</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{background:#1e293b;border-radius:16px;padding:32px 28px;max-width:420px;width:100%;box-shadow:0 25px 50px rgba(0,0,0,.4)}
.logo{text-align:center;margin-bottom:24px}
.logo svg{width:48px;height:48px}
h1{font-size:20px;text-align:center;margin-bottom:8px;color:#f8fafc}
.subtitle{text-align:center;font-size:14px;color:#94a3b8;margin-bottom:28px}
.download-btn{display:block;width:100%;padding:14px;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;text-align:center;text-decoration:none;transition:all .2s;margin-bottom:16px}
.download-btn.primary{background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff}
.download-btn.primary:active{transform:scale(.98);opacity:.9}
.platform-tag{display:inline-block;background:#334155;color:#94a3b8;padding:3px 10px;border-radius:20px;font-size:12px;margin-bottom:20px}
.steps{background:#0f172a;border-radius:12px;padding:20px;margin-top:4px}
.steps h2{font-size:15px;margin-bottom:14px;color:#f1f5f9}
.step{display:flex;gap:12px;margin-bottom:14px;font-size:13px;line-height:1.6;color:#cbd5e1}
.step:last-child{margin-bottom:0}
.step-num{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:#334155;color:#60a5fa;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px}
.note{margin-top:20px;padding:14px;background:rgba(234,179,8,.08);border:1px solid rgba(234,179,8,.2);border-radius:10px;font-size:12px;color:#fbbf24;line-height:1.6}
.note strong{color:#fcd34d}
.tabs{display:flex;gap:8px;margin-bottom:16px}
.tab{flex:1;padding:8px;border:1px solid #334155;border-radius:8px;background:transparent;color:#94a3b8;font-size:13px;cursor:pointer;text-align:center;transition:all .2s}
.tab.active{background:#334155;color:#f1f5f9;border-color:#475569}
.tab-content{display:none}
.tab-content.active{display:block}
</style>
</head>
<body>
<div class="card">
  <div class="logo">
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#3b82f6" stroke-width="2"/><path d="M24 12v10l7 7" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="24" r="4" fill="#3b82f6"/></svg>
  </div>
  <h1>安装 CA 证书</h1>
  <p class="subtitle">Anything Analyzer 需要安装根证书以解密 HTTPS 流量</p>
  <div style="text-align:center"><span class="platform-tag" id="platformTag">${platform === "ios" ? "🍎 iOS" : platform === "android" ? "🤖 Android" : "💻 桌面端"}</span></div>

  <a class="download-btn primary" href="http://${downloadHost}/cert.cer" id="downloadBtn">⬇ 下载证书</a>

  <div class="tabs">
    <button class="tab${platform === "ios" ? " active" : ""}" onclick="showTab('ios', this)">iOS</button>
    <button class="tab${platform === "android" ? " active" : ""}" onclick="showTab('android', this)">Android</button>
    <button class="tab${platform === "desktop" ? " active" : ""}" onclick="showTab('desktop', this)">桌面端</button>
  </div>

  <div id="tab-ios" class="tab-content${platform === "ios" ? " active" : ""}">
    <div class="steps">
      <h2>iOS 安装步骤</h2>
      <div class="step"><span class="step-num">1</span><span>点击上方按钮下载证书，在弹出窗口中选择「允许」</span></div>
      <div class="step"><span class="step-num">2</span><span>打开「设置」→「通用」→「VPN 与设备管理」→ 选择已下载的描述文件</span></div>
      <div class="step"><span class="step-num">3</span><span>点击「安装」并输入锁屏密码确认</span></div>
      <div class="step"><span class="step-num">4</span><span>前往「设置」→「通用」→「关于本机」→「证书信任设置」</span></div>
      <div class="step"><span class="step-num">5</span><span>开启「Anything Analyzer CA」的完全信任开关</span></div>
    </div>
    <div class="note"><strong>⚠ 重要：</strong>iOS 建议优先使用 <code>cert.anything.test</code> 下载。安装后还需在「证书信任设置」中手动启用完全信任。</div>
  </div>

  <div id="tab-android" class="tab-content${platform === "android" ? " active" : ""}">
    <div class="steps">
      <h2>Android 安装步骤</h2>
      <div class="step"><span class="step-num">1</span><span>点击上方按钮下载证书文件</span></div>
      <div class="step"><span class="step-num">2</span><span>打开「设置」→「安全」→「加密与凭据」→「安装证书」→「CA 证书」</span></div>
      <div class="step"><span class="step-num">3</span><span>选择已下载的证书文件并确认安装</span></div>
      <div class="step"><span class="step-num">4</span><span>部分系统需要在 WiFi 设置中将证书类型选为「VPN 和应用」或「WLAN」</span></div>
    </div>
    <div class="note"><strong>⚠ 注意：</strong>Android 7+ 默认不信任用户安装的 CA 证书。如需系统级信任，需要 root 或使用 Magisk 模块。大多数浏览器和应用仍可工作。</div>
  </div>

  <div id="tab-desktop" class="tab-content${platform === "desktop" ? " active" : ""}">
    <div class="steps">
      <h2>桌面端安装步骤</h2>
      <div class="step"><span class="step-num">1</span><span>推荐直接在 Anything Analyzer 应用内点击「安装证书」按钮一键安装</span></div>
      <div class="step"><span class="step-num">2</span><span>或下载证书后手动双击安装到系统信任存储中</span></div>
    </div>
  </div>
</div>
<script>
function showTab(name, el){
  document.querySelectorAll('.tab-content').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(e=>e.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  if (el) el.classList.add('active');
}
</script>
</body>
</html>`;
}

/**
 * Get the CA certificate content as a Buffer for download.
 * Returns PEM-encoded certificate.
 */
export function getCertFileContent(caManager: CaManager): Buffer {
  const certPath = caManager.getCaCertPath();
  return readFileSync(certPath);
}
