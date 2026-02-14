const requests = new Map()

export default function rateLimit(req, res, next) {
    const ip = req.ip
    const now = Date.now()
    const windowTime = 60 * 1000 // 1 minute
    const maxRequests = 100

    if (!requests.has(ip)) {
        requests.set(ip, [])
    }

    const timestamps = requests.get(ip).filter(timestamp => now - timestamp < windowTime)

    timestamps.push(now)

    requests.set(ip, timestamps)

    // CORREGIDO
    if (timestamps.length > maxRequests) {
        return res.status(429).json({
            error: 'Demasiadas peticiones, intentalo después.'
        })
    }

    next()
}
