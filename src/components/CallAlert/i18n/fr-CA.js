import callErrors from 'ringcentral-integration/modules/Call/callErrors';

export default {
  [callErrors.noToNumber]: 'Veuillez entrer un numéro de téléphone valide.',
  [callErrors.noAreaCode]: 'Veuillez configurer l\'{areaCodeLink} pour utiliser des numéros de téléphone locaux à 7\xA0chiffres.',
  [callErrors.specialNumber]: 'La composition de numéros d\'urgence ou renvoyant à des services spéciaux n\'est pas prise en charge.',
  [callErrors.connectFailed]: 'Échec de la connexion. Veuillez réessayer plus tard.',
  [callErrors.internalError]: 'Connexion impossible en raison d\'erreurs internes. Veuillez réessayer plus tard.',
  [callErrors.notAnExtension]: 'Le numéro de poste n\'existe pas.',
  [callErrors.networkError]: 'Connexion impossible en raison de problèmes de réseau. Veuillez réessayer plus tard.',
  [callErrors.noRingoutEnable]: 'Votre poste est autorisé à effectuer des appels avec l\'application pour ordinateur de bureau.\n    Si vous souhaitez passer à d\'autres options d\'appel,\n    veuillez communiquer avec votre administrateur de compte pour une mise à niveau.',
  areaCode: 'indicatif régional',
  telus911: 'La composition d\'urgence n\'est pas prise en charge.',
};

// @key: @#@"[callErrors.noToNumber]"@#@ @source: @#@"Please enter a valid phone number."@#@
// @key: @#@"[callErrors.noAreaCode]"@#@ @source: @#@"Please set {areaCodeLink} to use 7-digit local phone numbers."@#@
// @key: @#@"[callErrors.specialNumber]"@#@ @source: @#@"Dialing emergency or special service numbers is not supported."@#@
// @key: @#@"[callErrors.connectFailed]"@#@ @source: @#@"Connection failed. Please try again later."@#@
// @key: @#@"[callErrors.internalError]"@#@ @source: @#@"Cannot connect due to internal errors. Please try again later."@#@
// @key: @#@"[callErrors.notAnExtension]"@#@ @source: @#@"The extension number does not exist."@#@
// @key: @#@"[callErrors.networkError]"@#@ @source: @#@"Cannot connect due to network issues. Please try again later."@#@
// @key: @#@"[callErrors.noInternational]"@#@ @source: @#@"You don't have permissions to make international calls. Please contact your {brand} account administrator for an upgrade."@#@
// @key: @#@"[callErrors.noRingoutEnable]"@#@ @source: @#@"Your extension is allowed to make calls with desktop app.\n    If you wish to switch to other calling options\n    please contact your account administrator for an upgrade."@#@
// @key: @#@"areaCode"@#@ @source: @#@"area code"@#@
// @key: @#@"telus911"@#@ @source: @#@"Emergency dialing is not supported."@#@
