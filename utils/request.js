const BASE_URL = 'https://api.imooc-blog.lgdsunday.club/api';
const request = function({url, data, method}){
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      data,
      method,
      success: ({ data, statusCode, header }) => {
        if(data.success){
          return resolve(data)
        }else{
          uni.showToast({
            title: data.message,
            icon: 'none',
            mask: true,
            duration: 3000
          })
          return reject(data.message)
        }
      },
      fail: (error) => {
        reject(error);
      }
    })
  })
}

export default request