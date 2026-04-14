// /functions/score.js
export async function onRequestPost(context) {
    const { env, request } = context;

    // 1. 設定 CORS (讓你的網頁可以跨域請求)
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        // 2. 獲取遊戲傳來的數據
        const stats = await request.json();
        
        // 這裡將數據格式化為對應 Supabase 表格的欄位
        // 根據你的描述，欄位名稱為 id, fragments, hp, play_time
        const payload = {
            id: stats.id,
            fragments: stats.fragments,
            hp: stats.hp,
            play_time: stats.play_time
        };

        // 3. 轉發給 Supabase
        // 注意：這裡的 /rest/v1/spacegame 對應的是你在 Supabase 的 Table 名稱
        const res = await fetch(`${env.SUPABASE_URL}/rest/v1/spacegame`, {
            method: 'POST',
            headers: {
                'apikey': env.SUPABASE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });

        return new Response(JSON.stringify({ success: res.ok }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500
        });
    }
} // <-- 這裡補回了 onRequestPost 的結束括號

// 處理 OPTIONS 請求（瀏覽器必備，解決 CORS 預檢問題）
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    });
}