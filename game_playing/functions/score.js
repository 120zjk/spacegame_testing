export async function onRequestPost(context) {
    const { env, request } = context;
    
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        const stats = await request.json();
        
        // 確保 payload 的 key 與你 Supabase 的欄位名一致
        const payload = {
            id: stats.id,          // 你提到 Supabase 裡是 id
            fragments: stats.fragments,
            hp: stats.hp,
            play_time: stats.play_time
        };

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

        // 返回 Supabase 的結果
        return new Response(JSON.stringify({ success: res.ok }), {
            status: res.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}

// 必須保留這個，否則跨域請求會失敗
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    });
}