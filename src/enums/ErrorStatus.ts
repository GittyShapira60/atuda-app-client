export enum ErrorStatus {
  NotFound = 404,
  Forbidden = 403,
  Unauthorized = 401,
  BadRequest = 400,
  InternalServerError = 500,
  ServiceUnavailable = 503,
  PayloadTooLarge = 413,
}

export const ErrorStatusMessage = new Map<number, string>([
  [ErrorStatus.NotFound, 'הנתיב או המשאב שנדרש לא נמצא'],
  [
    ErrorStatus.Forbidden,
    'שימו לב, הגישה לאזור הבקשות מותרת רק לעתודאים אקדמים בזמן הלימודים ולכאלו שעזבו את המסלול. במידה והינכם נמנים באוכלוסייה הרלוונטית ורואים הודעה זו, עליכם לפנות למוקד מדור סטודנטים של העתודה האקדמית',
  ],
  [ErrorStatus.BadRequest, ' ישנם נתונים לא תקינים - הבקשה לא נשלחה לשרת'],
  [
    ErrorStatus.Unauthorized,
    'שימו לב, הגישה לאזור הבקשות מותרת רק לעתודאים אקדמים בזמן הלימודים ולכאלו שעזבו את המסלול. במידה והינכם נמנים באוכלוסייה הרלוונטית ורואים הודעה זו, עליכם לפנות למוקד מדור סטודנטים של העתודה האקדמית',
  ],
  [ErrorStatus.InternalServerError, 'השרת נתקל בתקלה פנימית בעת עיבוד הבקשה'],
  [ErrorStatus.ServiceUnavailable, 'השרת אינו זמין לטיפול בבקשה'],
  [ErrorStatus.PayloadTooLarge, 'מטען גדול מדי'],
])
