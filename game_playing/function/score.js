// /functions/score.js
export async function onRequestPost(context) {
    const { env, request } = context;
    
    // 1. 設定 CORS (讓你的網頁可以跨域請求)
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. 獲取遊戲傳來的數據
    const stats = await request.json();

    // 3. 轉發給 Supabase
    // 注意：env.SUPABASE_URL 等變數稍後在網頁後台設定
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/spacegame`, {
        method: 'POST',
        headers: {
            'apikey': env.SUPABASE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            employee_id: stats.employee_id,
            fragments: stats.fragments,
            hp: stats.hp,
            play_time: stats.play_time
        })
    });

    return new Response(JSON.stringify({ success: res.ok }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
}

// 處理 OPTIONS 請求（瀏覽器必備）
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    });
}