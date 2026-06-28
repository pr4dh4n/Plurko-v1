# Catalog seed data, mirrored from the site's PRODUCT_TREE.
# Category -> either {subcategory: [products]} or [products] (no subcategory).
PRODUCT_TREE = {
    "High speed interface IP Core": {
        "PCIe": ["PCIe Gen 5 Controller", "PCIe Gen 4 Controller", "PCIe Gen 3 Controller", "PCIe Gen 2 Controller", "PCIe Gen 5 PHY", "PCIe Gen 4 PHY", "PCIe Gen 3 PHY", "PCIe Gen 2 PHY", "PCIe Gen 5 Switch"],
        "USB": ["USB4 Host Controller", "USB 3.2 Controller", "USB 2.0 OTG Controller", "USB 2.0 PHY", "USB 3.2 PHY", "USB Type-C Controller", "USB PD Controller"],
        "Ethernet": ["10G Ethernet MAC", "25G Ethernet MAC", "100G Ethernet MAC", "10G Ethernet PHY", "25G Ethernet PHY", "1G Ethernet MAC", "1G SGMII PHY", "TSN Ethernet Switch"],
        "MIPI": ["MIPI D-PHY", "MIPI C-PHY", "MIPI CSI-2 Controller", "MIPI DSI-2 Controller", "MIPI M-PHY", "MIPI UniPro"],
        "SerDes": ["28G LR SerDes", "56G PAM4 SerDes", "112G PAM4 SerDes", "16G SR SerDes"],
        "CXL": ["CXL 2.0 Controller", "CXL 3.0 Controller", "CXL 2.0 PHY"],
        "UCIe": ["UCIe 1.1 Controller", "UCIe 1.1 PHY"],
        "Die-to-Die": ["BoW Die-to-Die Interface", "HBI 2.0 Die-to-Die"],
    },
    "Memory IP Core": {
        "DDR": ["DDR5 Controller", "DDR4 Controller", "DDR5 PHY", "DDR4 PHY", "LPDDR5 Controller", "LPDDR5 PHY", "LPDDR4X Controller", "LPDDR4X PHY"],
        "HBM": ["HBM3 Controller", "HBM3 PHY", "HBM2E Controller", "HBM2E PHY"],
        "GDDR": ["GDDR6 Controller", "GDDR6 PHY", "GDDR7 Controller"],
        "Flash / Storage": ["eMMC 5.1 Controller", "UFS 4.0 Controller", "NVMe Controller", "ONFI Flash Controller", "SD/SDIO Controller"],
        "SRAM / ROM": ["High-Density SRAM Compiler", "Ultra-Low-Power SRAM", "ROM Compiler", "Register File Compiler", "Multi-Port SRAM"],
    },
    "Peripheral and Cryptographic IP Core": {
        "Security": ["AES-128/256 Engine", "SHA-2/SHA-3 Engine", "RSA/ECC Public Key Accelerator", "TRNG (True Random Number Generator)", "Inline AES-XTS for Storage", "MACsec Engine", "IPsec Engine", "Crypto Coprocessor"],
        "AMBA / Bus": ["AXI4 Interconnect", "AHB-Lite Bridge", "APB Bridge", "AXI-to-AHB Bridge", "NOC (Network on Chip)"],
        "Peripheral": ["I2C Controller", "SPI Controller", "UART Controller", "I3C Controller", "CAN-FD Controller", "GPIO Controller", "Timer / Watchdog", "DMA Controller", "Interrupt Controller"],
        "Display": ["HDMI 2.1 TX Controller", "HDMI 2.1 RX Controller", "DisplayPort 2.0 TX", "DisplayPort 2.0 RX", "LVDS TX/RX", "eDP 1.4 Controller"],
    },
    "Analog IP Core": {
        "ADC/DAC": ["12-bit 8 GSPS ADC", "14-bit 600 MSPS ADC", "12-bit 200 MSPS ADC", "10-bit 2.5 GSPS ADC", "16-bit 5 MSPS DAC", "12-bit 1.6 GSPS DAC", "14-bit 8 GSPS DAC", "6-bit 1 GSPS ADC", "12-bit 4 GSPS IQ ADC", "7-bit 64 GSPS ADC"],
        "PLL": ["High Performance PLL 3.5GHz", "Low Jitter 250 MHz PLL", "200-500 MHz PLL", "GNSS ADPLL L1", "GNSS ADPLL L5"],
        "AFE": ["8-Ch 2.4 GSPS AFE", "16 ADC + 18 DAC Integrated AFE", "14-bit Swift ADC + PGA AFE", "8-Ch 10-bit 2.5 GS/s AFE"],
        "LDO": ["LDO 1.1V 30mA", "LDO 1.8V 300mA", "LDO Capless 25mA", "LDO 5V-3.3V Input"],
        "PVT / Sensor": ["Temperature Voltage Monitor", "PVT Monitor with Interrupt", "Latch-Up Protection Module"],
        "Oscillator": ["16 MHz RC Oscillator", "32.768 kHz RC Oscillator", "16 MHz Temp-Stable Oscillator"],
    },
    "Verification IP Cores": ["CAN VIP", "LIN VIP", "SPI VIP", "UART VIP", "A-PHY VIP", "UCIe VIP", "USB4 VIP", "GDDR6 UVM VIP", "CPRI VIP", "JESD204B VIP", "MIPI I3C UVM VIP", "AXI VIP", "AHB Lite VIP", "LPC Controller VIP"],
    "EDA Tools": ["SoC Generator", "Chip Agent — Agentic AI for Chip Design"],
}
