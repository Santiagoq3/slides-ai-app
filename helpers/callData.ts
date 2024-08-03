

export const callData = async(prompt: string): Promise<any> => {
    const body = {
        prompt
    }
   
    const result = await fetch(`/api/completion`, {
       method :"POST",
       body: JSON.stringify(body),
       headers: {
        'Content-Type': 'application/json'
       }
    })
    .then(res => res.json())
   
    return result;
 }