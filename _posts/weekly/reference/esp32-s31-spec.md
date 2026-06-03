# ESP32-S31 — 规格参数

> 数据来源：
> - [乐鑫官网 - ESP32-S3 系列](https://www.espressif.com/zh-hans/products/socs/esp32-s3)
> - [ESP32-S31-Korvo-1 V1.1 用户指南](https://documentation.espressif.com/projects/esp-dev-kits/zh_CN/latest/esp32s31/esp32-s31-korvo-1/user_guide.html)
> - 采集日期：2026-06-03

> ⚠️ **注意**：ESP32-S31 是 ESP32-S3 的下一代产品。本文档数据基于 ESP32-S31-Korvo-1 V1.1 开发板及 ESP32-S31-WROOM-3 模组规格。

---

## 产品图

![ESP32-S31-Korvo-1 V1.1 开发板](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp31-korvo-0.png)

*ESP32-S31-Korvo-1 V1.1 — 板载 ESP32-S31-WROOM-3 模组*

![ESP32-S31-Korvo-1 V1.1 组件标注](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp31-korvo-1.png)

*开发板组件标注（点击放大视图）*

![电气功能框图](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp31-korvo-2.png)

*ESP32-S31-Korvo-1 V1.1 电气功能框图*

---

## 核心规格（ESP32-S31-WROOM-3 模组）

| 项目 | 参数 |
|:---|:---|
| **芯片** | ESP32-S31 |
| **Wi-Fi** | 2.4 GHz Wi-Fi 6（802.11ax） |
| **蓝牙** | 蓝牙 5.4 + 经典蓝牙 |
| **802.15.4** | Zigbee 3.0 + Thread 1.4 |
| **Flash** | 16 MB SPI flash（板载） |
| **PSRAM** | 16 MB（芯片内置） |
| **天线** | PCB 天线 |

## 与 ESP32-S3 的关键差异

| 维度 | ESP32-S3 | ESP32-S31 ⭐ |
|:---|:---|:---|
| **Wi-Fi** | Wi-Fi 4 (802.11 b/g/n) | **Wi-Fi 6 (802.11ax)** |
| **蓝牙** | BT 5 (LE) | **BT 5.4 + 经典蓝牙** |
| **802.15.4** | 不支持 | **Zigbee 3.0 + Thread 1.4** |
| **PSRAM** | 外挂 ≤8 MB | **芯片内置 16 MB** |
| **模组 Flash** | ≤16 MB | **16 MB** |
| **AI 加速** | 向量指令 | 向量指令（继承 S3） |
| **低功耗** | ULP 协处理器 | ULP 协处理器（继承） |

---

## ESP32-S31-Korvo-1 V1.1 开发板硬件资源

### 音频子系统

| 组件 | 规格 | 安全帽用途 |
|:---|:---|:---|
| **Audio Codec** | ES8389（双声道 ADC/DAC，低功耗） | ✅ 语音采集与播放核心 |
| **麦克风** | 左右双模拟麦克风 | ✅ 双麦阵列降噪 |
| **扬声器 PA** | NS4150B × 2（低 EMI，3W D 类） | ✅ 左右声道各 3W |
| **扬声器接口** | 2 路 2.00mm 间距输出 | ✅ 可驱 4Ω/3W 喇叭 |
| **音频独立供电** | 5V→3.3V LDO 独立供电 | ✅ 隔离数字噪声，工地嘈杂环境关键 |
| **功能按键** | PLAY / SET / VOL- / VOL+ | ✅ 可复用为 SOS 等 |

### 摄像头与显示

| 组件 | 规格 | 安全帽用途 |
|:---|:---|:---|
| **摄像头接口** | 专用连接器，支持 OV3660 模组 | ✅ 1080P 拍照/录像 |
| **摄像头供电** | 3.3V→2.8V + 3.3V→1.5V 双 LDO | ✅ 独立稳定供电 |
| **LCD 接口** | 专用连接器（ESP32-S3-LCD-EV-Board-SUB3） | ⚪ 安全帽无需 |

### 存储与外设

| 组件 | 规格 | 安全帽用途 |
|:---|:---|:---|
| **microSD 卡槽** | SDIO 3.0，4-bit 模式 | ✅ 本地视频/日志存储 |
| **SPI NAND Flash** | 四线 SPI（默认不上件，与 microSD 复用） | ⚪ 可选 |
| **RGB LED** | 可寻址，GPIO8 驱动 | ✅ 状态指示 |
| **USB Type-A Host** | USB 2.0，最高 500mA 输出 | ✅ 可接 4G 模块 |
| **USB Type-C UART** | 供电 + 烧录 + 通信（3 Mbps） | 开发/调试 |
| **USB Type-C Power** | 仅供电 | 独立供电口 |

### 供电系统

![USB 电源供电](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp31-korvo-3.png)

*USB 供电方案 — 双 Type-C 口冗余供电*

![音频独立供电](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp31-korvo-4.png)

*音频独立供电方案 — 数字/模拟电源隔离，降低噪声*

| 供电方式 | 说明 |
|:---|:---|
| **USB 供电** | 双 Type-C 口（UART 口 + Power 口），均为 5V；大功率场景需确保 3A 总输入 |
| **Buck 降压** | DC-DC 降压至 3.3V 系统供电 |
| **音频独立供电** | 5V→3.3V LDO 为音频电路独立供电 |
| **摄像头供电** | 3.3V→2.8V + 3.3V→1.5V 双 LDO |

### 扩展存储

![microSD 卡功能](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp31-korvo-5.png)

*microSD 卡功能 — SDIO 3.0 4-bit 模式*

![SPI NAND Flash 功能](https://ysdcedarqu.github.io/zhinenganquanmao/assets/images/esp31-korvo-6.png)

*SPI NAND Flash 功能 — 默认不上件，需改焊切换*

---

## 开发板软件生态

- **开发框架**：ESP-IDF
- **音频**：ESP-Skainet（语音唤醒/识别）、ESP-GMF（通用多媒体框架）、蓝牙音频（经典 + LE Audio）
- **视频**：ESP Video Components（摄像头、视频流、视频处理）
- **图形**：ESP-Brookesia（HMI 开发框架）
- **低功耗蓝牙**：ESP-BLE-MESH、ESP-BLE-AUDIO
- **Matter**：ESP-Matter（Matter + Thread 协议）

---

## 价格参考

- ESP32-S31 芯片 / 模组：新品，价格待确认（预估与 S3 同级别，¥20–40）
- ESP32-S31-Korvo-1 V1.1 开发板：新品，价格待确认

---

## 开发板尺寸（主板）

| 版本 | 说明 |
|:---|:---|
| **V1.0** | 绿色油墨，LCD 子板延伸至板外，方便调试 |
| **V1.1** | 哑光黑色油墨，PCB 尺寸更大，LCD 子板叠放于主板之上 |
