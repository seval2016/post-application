const winston = require('winston');

// Hassas bilgileri maskeleyen fonksiyon
const maskSensitiveData = (data) => {
  if (!data) return data;
  
  const sensitiveFields = ['password', 'token', 'email', 'phone'];
  const maskedData = { ...data };
  
  sensitiveFields.forEach(field => {
    if (maskedData[field]) {
      maskedData[field] = '***MASKED***';
    }
  });
  
  return maskedData;
};

// Logger konfigürasyonu
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format((info) => {
          info.data = maskSensitiveData(info.data);
          return info;
        })()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format((info) => {
          info.data = maskSensitiveData(info.data);
          return info;
        })()
      )
    })
  ]
});

// Development ortamında console'a da logla
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format((info) => {
        info.data = maskSensitiveData(info.data);
        return info;
      })()
    )
  }));
}

module.exports = logger; 