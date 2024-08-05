export default interface Shop {
  shop_id: number | string; // 店铺ID
  shop_name: string; // 店铺名称
  owner_user_id: number | string; // 店铺负责人的用户ID
  phone: string; // 联系信息
  location: string; // 地址
  registration_date: Date; // 注册日期 开店审核通过时间
  shop_description: string; // 店铺描述
  shop_image: string; // 店铺图片的URL
  createTime?: Date; // 创建时间
  updateTime?: Date; // 更新时间
  status?: Status; // 店铺状态
} // 枚举类型
export enum Status {
  Active, // 正常
  Inactive, // 待审核
  Invalid, // 封禁
}
