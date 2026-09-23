export const fetchJson = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
    const response = await fetch(input, init)

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json() as Promise<T>
}

export const fetchGetHelper = () => {
    return {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
}

export const fetchPostHelper = (request: any) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }
}

export const fetchUpdateHelper = (request: any) => {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }
}

export const fetchDeleteHelper = () => {
    return {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }
}
