export interface FormField {
  type: string; // 输入类型，如 'text', 'number', 'date' 等
  label: string; // 字段标签
  prop: string; // 绑定的数据属性
  rules?: any[]; // 验证规则
  options?: { value: any; label: string }[]; // 选项列表（对于选择器）
  placeholder?: string;
  uploadConfig?: any;
}

export interface DialogFormProps {
  title: string;
  visible: boolean;
  labelPosition: any;
  fields: FormField[];
}

// [
//   {
//     type: "text",
//     label: "用户名",
//     prop: "username",
//     rules: [
//       { required: true, message: "请输入用户名", trigger: "blur" },
//       { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
//     ],
//     placeholder: "请输入用户名",
//   },
//   {
//     type: "number",
//     label: "年龄",
//     prop: "age",
//     rules: [
//       { required: true, message: "请输入年龄", trigger: "blur" },
//       { min: 18, max: 99, message: "年龄应在 18 至 99 之间", trigger: "blur" },
//     ],
//     placeholder: "请输入年龄",
//   },
//   {
//     type: "select",
//     label: "性别",
//     prop: "gender",
//     options: [
//       { value: "male", label: "男" },
//       { value: "female", label: "女" },
//     ],
//     placeholder: "请选择性别",
//   },
//   {
//     type: "datepicker",
//     label: "出生日期",
//     prop: "birthdate",
//     rules: [{ required: true, message: "请选择出生日期", trigger: "change" }],
//     placeholder: "请选择出生日期",
//   },
//   {
//     type: "radio",
//     label: "婚姻状况",
//     prop: "marriageStatus",
//     options: [
//       { value: "single", label: "单身" },
//       { value: "married", label: "已婚" },
//       { value: "divorced", label: "离异" },
//     ],
//     placeholder: "请选择婚姻状况",
//   },
//   {
//     type: "checkbox",
//     label: "兴趣爱好",
//     prop: "hobbies",
//     options: [
//       { value: "reading", label: "阅读" },
//       { value: "traveling", label: "旅行" },
//       { value: "cooking", label: "烹饪" },
//     ],
//     placeholder: "请选择兴趣爱好",
//   },
//   {
//     type: "textarea",
//     label: "个人简介",
//     prop: "description",
//     rules: [{ required: true, message: "请输入个人简介", trigger: "blur" }],
//     placeholder: "请输入个人简介",
//   },
//   {
//     type: "uploader",
//     label: "上传文件",
//     prop: "file",
//     rules: [{ required: true, message: "请上传文件", trigger: "change" }],
//     uploadConfig: {
//       uploadAction: "http://localhost:8080/upload",
//       multiple: true,
//       limit: 1,
//     },
//   },
// ];
