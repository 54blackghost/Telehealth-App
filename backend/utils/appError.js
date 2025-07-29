class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

//Le code ci-dessus est utile pour le suivi et la traçabilité des erreurs. Il fournit également l'URL et l'emplacement du fichier où l'erreur pourrait se produire, ce qui facilite la gestion et le débogage des erreurs.