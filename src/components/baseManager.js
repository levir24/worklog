export const BASEURL = '/worklog/api'
export const BASEDATA = '/freeloader/api/data'
export const BASEAPP = '/worklog/api/server'

export async function baseFetch(URL,method,data) {
    var token = localStorage.token
    //console.log("basefetch ",URL,method,token,data)

    return fetch(URL,{ method: method, body: JSON.stringify(data),
    headers: {'Accept': 'application/json','Content-Type': 'application/json','access-token': token}
    }).then(
        (response) => {
        if (response.ok) 
            return response.json()
        if (response.status === 403) 
            alert("Server error Not Logged In")
        else
            alert("Server error "+response.statusText)
        return([])
        } 
        )
}

export function baseReload(URL) {
  return fetch(URL).then(
    (response) => {
      if (response.ok) 
        return response.json()
      throw new Error(response.status+' '+response.statusText);
     } 
    )
}
