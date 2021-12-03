import jwt from "jsonwebtoken";

const secret = 'test';

// sau khi user đăng nhập và muốn thực hiện bất cứ request nào 
// thì req đó phải qua middleware này để server xác thật(authenticate)
// user đó có quyền truy cập đến  và lấy dữ liệu không

// ex: click the like button => auth middleware (next) => like controllers..
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("recieve from client'request: ", token);

    if (!token) res.status(401).json({ message: 'Unauthorized !'});

    const isCustomAuth = token.length < 500;
    // nếu token này > 500 thì nó là của Google OAuth, còn không thì nó là của ta tạo nên
    let decodedData;

    if (token && isCustomAuth) {
      // giải mã token để lấy thông tin id và email của user      
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      // giải mã token của google OAth
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;// sub is a specific name for google Id
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;