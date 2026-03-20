const output = document.getElementById('output')
const baseUrlInput = document.getElementById('baseUrl')
const accessTokenInput = document.getElementById('accessToken')
const saveTokenBtn = document.getElementById('saveToken')
const clearTokenBtn = document.getElementById('clearToken')

const storedToken = localStorage.getItem('accessToken')
if (storedToken) {
    accessTokenInput.value = storedToken
}

const setOutput = (label, data) => {
    const timestamp = new Date().toISOString()
    const payload = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    output.textContent = `[${timestamp}] ${label}\n${payload}`
}

const setPanelOutput = (elementId, label, data) => {
    const panel = document.getElementById(elementId)
    if (!panel) return
    const payload = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    panel.textContent = `[${label}]\n${payload}`
}

const getBaseUrl = () => baseUrlInput.value.replace(/\/$/, '')
const getAccessToken = () => accessTokenInput.value.trim()

const apiRequest = async (path, { method = 'GET', body, auth = false } = {}) => {
    const headers = { 'Content-Type': 'application/json' }
    if (auth) {
        const token = getAccessToken()
        if (token) headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${getBaseUrl()}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
    })

    const text = await res.text()
    let data = text
    try {
        data = text ? JSON.parse(text) : ''
    } catch (err) {
        data = text
    }

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}\n${typeof data === 'string' ? data : JSON.stringify(data)}`)
    }

    return data
}

const wrapErrors =
    (label, fn) =>
    async (...args) => {
        try {
            await fn(...args)
        } catch (err) {
            setOutput(label, err.message)
        }
    }

const activateTab = (tabName) => {
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.tab === tabName)
    })
    document.querySelectorAll('.panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === tabName)
    })
}

document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        activateTab(tab.dataset.tab)
    })
})

saveTokenBtn.addEventListener('click', () => {
    localStorage.setItem('accessToken', getAccessToken())
    setOutput('Token saved', { token: getAccessToken() })
})

clearTokenBtn.addEventListener('click', () => {
    accessTokenInput.value = ''
    localStorage.removeItem('accessToken')
    setOutput('Token cleared', '')
})

const registerForm = (formId, handler) => {
    const form = document.getElementById(formId)
    if (!form) return
    form.addEventListener(
        'submit',
        wrapErrors(formId, async (event) => {
            event.preventDefault()
            const formData = new FormData(form)
            const payload = Object.fromEntries(formData.entries())
            await handler(payload)
            form.reset()
        }),
    )
}

registerForm('registerForm', async (payload) => {
    payload.department = Number(payload.department)
    const data = await apiRequest('/auth/register', { method: 'POST', body: payload })
    setOutput('Register success', data)
    setPanelOutput('accountOutput', 'Register', data)
})

registerForm('loginForm', async (payload) => {
    const data = await apiRequest('/auth/login', { method: 'POST', body: payload })
    if (data?.accessToken) {
        accessTokenInput.value = data.accessToken
        localStorage.setItem('accessToken', data.accessToken)
    }
    setOutput('Login success', data)
    setPanelOutput('accountOutput', 'Login', data)
})

registerForm('generalCreateForm', async (payload) => {
    const data = await apiRequest('/community/general/posts', { method: 'POST', body: payload, auth: true })
    setOutput('General post created', data)
    setPanelOutput('generalOutput', 'Create', data)
    activateTab('home')
})

registerForm('anonCreateForm', async (payload) => {
    const data = await apiRequest('/community/anonymous/posts', { method: 'POST', body: payload })
    setOutput('Anonymous post created', data)
    setPanelOutput('anonOutput', 'Create', data)
    activateTab('home')
})

registerForm('topicCreateForm', async (payload) => {
    const data = await apiRequest('/community/topics', { method: 'POST', body: payload, auth: true })
    setOutput('Topic created', data)
    setPanelOutput('topicOutput', 'Create Topic', data)
    activateTab('home')
})

registerForm('topicPostsCreateForm', async (payload) => {
    const slug = payload.slug
    delete payload.slug
    const data = await apiRequest(`/community/topics/${slug}/posts`, { method: 'POST', body: payload, auth: true })
    setOutput('Topic post created', data)
    setPanelOutput('topicOutput', 'Create Topic Post', data)
    activateTab('home')
})

const registerButton = (btnId, handler) => {
    const button = document.getElementById(btnId)
    if (!button) return
    button.addEventListener('click', wrapErrors(btnId, handler))
}

registerButton('generalListBtn', async () => {
    const page = document.getElementById('generalPage').value || 1
    const size = document.getElementById('generalSize').value || 20
    const data = await apiRequest(`/community/general/posts?page=${page}&size=${size}`)
    setOutput('General posts', data)
    setPanelOutput('generalOutput', 'List', data)
})

registerButton('generalListBtn2', async () => {
    const page = document.getElementById('generalPage').value || 1
    const size = document.getElementById('generalSize').value || 20
    const data = await apiRequest(`/community/general/posts?page=${page}&size=${size}`)
    setOutput('General posts', data)
    setPanelOutput('generalOutput', 'List', data)
})

registerButton('generalDetailBtn', async () => {
    const id = document.getElementById('generalDetailId').value
    if (!id) {
        setPanelOutput('generalOutput', 'Detail', 'Please provide a post id.')
        return
    }
    const data = await apiRequest(`/community/general/posts/${id}`)
    setOutput('General post detail', data)
    setPanelOutput('generalOutput', 'Detail', data)
})

registerButton('anonListBtn', async () => {
    const page = document.getElementById('anonPage').value || 1
    const size = document.getElementById('anonSize').value || 20
    const data = await apiRequest(`/community/anonymous/posts?page=${page}&size=${size}`)
    setOutput('Anonymous posts', data)
    setPanelOutput('anonOutput', 'List', data)
})

registerButton('anonListBtn2', async () => {
    const page = document.getElementById('anonPage').value || 1
    const size = document.getElementById('anonSize').value || 20
    const data = await apiRequest(`/community/anonymous/posts?page=${page}&size=${size}`)
    setOutput('Anonymous posts', data)
    setPanelOutput('anonOutput', 'List', data)
})

registerButton('anonDetailBtn', async () => {
    const id = document.getElementById('anonDetailId').value
    if (!id) {
        setPanelOutput('anonOutput', 'Detail', 'Please provide a post id.')
        return
    }
    const data = await apiRequest(`/community/anonymous/posts/${id}`)
    setOutput('Anonymous post detail', data)
    setPanelOutput('anonOutput', 'Detail', data)
})

registerButton('topicListBtn', async () => {
    const page = document.getElementById('topicPage').value || 1
    const size = document.getElementById('topicSize').value || 20
    const data = await apiRequest(`/community/topics?page=${page}&size=${size}`)
    setOutput('Topics', data)
    setPanelOutput('topicOutput', 'Topics List', data)
})

registerButton('topicListBtn2', async () => {
    const page = document.getElementById('topicPage').value || 1
    const size = document.getElementById('topicSize').value || 20
    const data = await apiRequest(`/community/topics?page=${page}&size=${size}`)
    setOutput('Topics', data)
    setPanelOutput('topicOutput', 'Topics List', data)
})

registerButton('topicDetailBtn', async () => {
    const slug = document.getElementById('topicDetailSlug').value.trim()
    if (!slug) {
        setPanelOutput('topicOutput', 'Topic Detail', 'Please provide a topic slug.')
        return
    }
    const data = await apiRequest(`/community/topics/${slug}`)
    setOutput('Topic detail', data)
    setPanelOutput('topicOutput', 'Topic Detail', data)
})

registerButton('topicPostsListBtn', async () => {
    const slug = document.getElementById('topicPostsSlug').value.trim()
    if (!slug) {
        setOutput('Topic posts', 'Please provide a topic slug.')
        setPanelOutput('topicOutput', 'Topic Posts', 'Please provide a topic slug.')
        return
    }
    const page = document.getElementById('topicPostsPage').value || 1
    const size = document.getElementById('topicPostsSize').value || 20
    const data = await apiRequest(`/community/topics/${slug}/posts?page=${page}&size=${size}`)
    setOutput('Topic posts', data)
    setPanelOutput('topicOutput', 'Topic Posts', data)
})

registerButton('topicPostDetailBtn', async () => {
    const slug = document.getElementById('topicPostDetailSlug').value.trim()
    const id = document.getElementById('topicPostDetailId').value
    if (!slug || !id) {
        setPanelOutput('topicOutput', 'Topic Post Detail', 'Please provide a topic slug and post id.')
        return
    }
    const data = await apiRequest(`/community/topics/${slug}/posts/${id}`)
    setOutput('Topic post detail', data)
    setPanelOutput('topicOutput', 'Topic Post Detail', data)
})

registerButton('meBtn', async () => {
    const data = await apiRequest('/auth/me', { auth: true })
    setOutput('Me', data)
    setPanelOutput('accountOutput', 'Me', data)
})

registerButton('refreshBtn', async () => {
    const data = await apiRequest('/auth/refresh', { method: 'POST' })
    if (data?.accessToken) {
        accessTokenInput.value = data.accessToken
        localStorage.setItem('accessToken', data.accessToken)
    }
    setOutput('Refresh success', data)
    setPanelOutput('accountOutput', 'Refresh', data)
})

registerButton('logoutBtn', async () => {
    await apiRequest('/auth/logout', { method: 'POST' })
    accessTokenInput.value = ''
    localStorage.removeItem('accessToken')
    setOutput('Logout success', '')
    setPanelOutput('accountOutput', 'Logout', 'Logged out')
})
