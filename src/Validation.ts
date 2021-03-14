// eslint-disable-next-line @typescript-eslint/no-var-requires
const factory = require('rdf-ext')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SHACLValidator = require('rdf-validate-shacl')

export async function validate(notificationDataset: any, shapesDataset: any) {  

  const validator = new SHACLValidator(shapesDataset, { factory })
  const report = await validator.validate(notificationDataset)

  console.log(`Shape conforms: ${report.conforms}, report length: ${report.results.length}`)
  return report.conforms
}
