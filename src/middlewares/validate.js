// src/middlewares/validador.js
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

//Usando 'export default' para exportar a função principal do módulo.
export default validate;