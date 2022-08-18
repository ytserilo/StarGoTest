export async function customFetch(url: string, method: string){
    return new Promise<any>(async (resolve, reject) => {
        const response = await fetch(url, {
            method: method,
            credentials: "same-origin"
        })
        if(response.status == 401){
            const response = await fetch("/api/refresh", {
                method: "POST",
                credentials: "same-origin"
            });
            
            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            document.cookie = `accessToken=${data.accessToken}`;
            
            const finRes = await fetch(url, {
                method: method,
                credentials: "same-origin"
            })
            if(finRes.status != 200){
                reject(finRes.status);
                return;
            }
            const result = await finRes.json();
            resolve(result);
            return;
        }

        if(response.status == 200){
            const data = await response.json();
            resolve(data);
        }
    
    })
    
    
}