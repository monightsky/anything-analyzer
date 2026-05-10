# Anything Analyzer v3.6.8

## 修复

- **局域网设备代理不可用** — 修复其他设备通过局域网连接 MITM 代理后无法正常使用的问题
	- 设备直接访问代理 IP 地址时返回证书下载页面，而非报错
	- 防止代理自连死循环（设备通过代理访问代理自身地址时正确拦截）
	- HTTPS 证书下载页支持：通过 CONNECT 隧道访问 `cert.anything.test` 时也能返回证书页
	- 证书下载链接自动适配：通过 IP 直接访问时，下载链接指向当前 IP 而非需要 DNS 的域名
- **HTTPS 非标准端口 Host 头错误** — 修复转发 HTTPS 请求时 `Host` 头丢失端口号（如 `example.com:8443` 被错误发为 `example.com`），导致目标服务器拒绝请求
- **WebSocket 升级 Host 头错误** — 修复 HTTP 和 HTTPS WebSocket 升级请求中 `Host` 头同样缺少端口号的问题

## 改进

- **显示本机局域网 IP** — MITM 代理设置页面现在直接展示本机局域网 IP 地址和端口，方便其他设备快速配置代理

## 下载

| 平台 | 文件 |
|------|------|
| Windows | Anything-Analyzer-Setup-3.6.8.exe |
| macOS (Apple Silicon) | Anything-Analyzer-3.6.8-arm64.dmg |
| macOS (Intel) | Anything-Analyzer-3.6.8-x64.dmg |
| Linux | Anything-Analyzer-3.6.8.AppImage |
