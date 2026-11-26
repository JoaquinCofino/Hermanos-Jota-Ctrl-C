function logger(req, res, next){
    
    const fecha = new Date().toLocaleString('es-AR', { 
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    });

    console.log(`[${fecha}] [${req.method}] ${req.originalUrl}`);
    next();
}

module.exports = logger;