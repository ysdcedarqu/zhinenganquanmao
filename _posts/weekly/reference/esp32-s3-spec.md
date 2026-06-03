# ESP32-S3 — 规格参数

> 数据来源：[乐鑫官网 - ESP32-S3](https://www.espressif.com/zh-hans/products/socs/esp32-s3)
> 采集日期：2026-06-03

## 产品图

![ESP32-S3 Banner](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp32-s3-banner.jpg)

*ESP32-S3 — 专为 AIoT 市场打造，集成 Wi-Fi + Bluetooth 5 (LE) + AI 加速*

![ESP32-S3 AI 加速](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp32-s3-ai-support.png)

*向量指令加速神经网络计算与信号处理*

![ESP32-S3 芯片系列](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp32-s3-chip-series.png)

*ESP32-S3 芯片 · 模组 · 开发板 产品矩阵*

---

## 核心规格

| 项目 | 参数 |
|:---|:---|
| **CPU** | Xtensa® 32 位 LX7 双核处理器，最高 240 MHz |
| **AI 加速** | 向量指令（vector instructions），用于加速神经网络计算和信号处理 |
| **SRAM** | 512 KB（TCM） |
| **Flash** | 支持 Octal SPI flash，最大 16 MB（片外） |
| **PSRAM** | 支持 Octal SPI PSRAM，最大 8 MB（片外） |
| **GPIO** | 45 个可编程 GPIO |
| **触摸** | 14 个 GPIO 可配置为电容触摸 |

## 无线连接

| 项目 | 参数 |
|:---|:---|
| **Wi-Fi** | 2.4 GHz 802.11 b/g/n，40 MHz 带宽 |
| **蓝牙** | Bluetooth 5 (LE)，支持 Bluetooth Mesh、Coded PHY（远距离）、2 Mbps PHY |

## 外设接口

| 接口 | 说明 |
|:---|:---|
| **SPI** | 多个 SPI 控制器 |
| **I2S** | 音频接口 |
| **I2C** | 多个 I2C 控制器 |
| **PWM** | LED 控制、电机等 |
| **RMT** | 红外遥控等 |
| **ADC** | 模拟数字转换 |
| **UART** | 多个串口 |
| **SD/MMC** | SD 卡接口 |
| **TWAI** | CAN 总线控制器 |
| **USB OTG** | USB 2.0 OTG |

## 低功耗

| 项目 | 参数 |
|:---|:---|
| **协处理器** | 超低功耗协处理器（ULP） |
| **低功耗模式** | 多种低功耗模式（Active / Modem-sleep / Light-sleep / Deep-sleep） |
| **Deep-sleep 功耗** | 约 7 μA |

## 安全机制

- AES-XTS 算法 Flash 加密
- RSA 算法安全启动
- 数字签名 & HMAC
- 「世界控制器」：两个互不干扰的执行环境（可信执行环境 / 权限分离）

## 软件生态

- **开发框架**：ESP-IDF（历经数亿设备验证）
- **AI 库**：ESP-DSP（信号处理）、ESP-NN（神经网络加速）
- **应用框架**：ESP-WHO（人脸识别）、ESP-Skainet（语音唤醒/识别）
- **开发板**：ESP32-S3-DevKitC-1、ESP32-S3-EYE（摄像头）、ESP32-S3-Korvo-1/2（语音）、ESP32-S3-BOX-3（AIoT）

## 模组参考

| 模组 | Flash | PSRAM |
|:---|:---|:---|
| ESP32-S3-WROOM-1 | 4/8/16 MB | 2/8 MB |
| ESP32-S3-MINI-1 | 4/8/16 MB | 2/8 MB |

## 价格参考

- ESP32-S3 芯片：约 ¥15–25
- ESP32-S3-WROOM-1 模组（16MB Flash + 8MB PSRAM）：约 ¥25–35
- ESP32-S3-DevKitC-1 开发板：约 ¥79–99

## 芯片封装

- QFN 56 引脚，7mm × 7mm
