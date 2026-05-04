export enum ErrorSchema {
  MissingField = 'נא מלא שדה זה',
  SizeFileLarge = 'גודל הקובץ גדול מידי',
  MinProperties = 'must NOT have fewer than 1 properties',
  MissingProperty = 'must match a schema in anyOf',
  InvalidFileType = 'תוכן הקובץ לא תואם את הסוגים המאופשרים',
  Pattern = 'must match pattern',
  maxRangeMonths = 'התאריכים צריכים להיות בטווח של מקסימום',
}

export const ErrorSchemaMessage = new Map<string, string>([
  [ErrorSchema.MinProperties, 'בחר לפחות אחת מן האפשרויות'],
  [
    ErrorSchema.MissingProperty,
    'באם אתה מקבל סיוע כלכלי מההורים עליך לצרף את כל המסמכים הקשורים אליהם, אחרת צרף אישור של סאל או נוטריון',
  ],
  [ErrorSchema.Pattern, 'נמצאו תווים לא חוקיים'],
  [ErrorSchema.SizeFileLarge, 'גודל הקובץ גדול מידי'],
  [ErrorSchema.maxRangeMonths, 'התאריכים צריכים להיות בטווח של מקסימום'],
])
