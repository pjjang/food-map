const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");

const indexDao = require("../dao/indexDao");

// 식당 조회
exports.readRestaurants = async function (req, res) {

  const { category } = req.query;

  //카테고리 값이 넘어 왔다면 유효성검사 체크
  if (category) {
    const validCategory = [
      "한식",
      "중식",
      "일식",
      "양식",
      "분식",
      "구이",
      "회/초밥",
      "기타",
    ];
 
    if (!validCategory.includes(category)) {
      return res.send({        
        isSuccess: false,
        code: 200,
        message: "유효한 카테고리가 아닙니다.",
      });
    }
  }
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectRestaurants(connection, category);     
       return res.send({
        result: rows,
        isSuccess: true,
        code: 200,
        message: "맛집 목록 요청 성공",
       });
    } catch (err) {
      logger.error(`readRestaurants Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readRestaurants DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.deleteStudent = async function (req, res) {
  const { studentIdx } = req.params;

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
     
      const isValidStudentIdx = await indexDao.isValidStudentIdx(connection, studentIdx);     
          
      if (!isValidStudentIdx) {
        return res.send({       
         isSuccess: false,
         code: 410,
         message: "유효한 학생 인덱스가 아닙니다.",
        });
      }    

      const [rows] = await indexDao.deleteStudent(connection, studentIdx);     
       return res.send({        
        isSuccess: true,
        code: 200,
        message: "학생 삭제 성공",
       });
    } catch (err) {
      logger.error(`deleteStudent Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`deleteStudent DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}
// 학생 업데이트
exports.updateStudent = async function (req, res) {
  const { studentName, major, birth, address} = req.body;
  const {studentIdx} = req.params;
  
  if (studentName && typeof studentName !== "string") {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "문자값에 다른값을 넣을수 없습니다."
    });
  }

  if (major && typeof major !== "string") {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "문자값에 다른값을 넣을수 없습니다."
    });
  }

  if (address && typeof address !== "string") {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "문자값에 다른값을 넣을수 없습니다."
    });
  }

    
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if(birth && !regex.test(birth)) {
      return res.send({
        isSuccess: false,
        code: 400,
        message: "날짜 형식을 확인해주세요.",
      });
    }
    
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      
      try {
        const isValidStudentIdx = await indexDao.isValidStudentIdx(connection, studentIdx);
                
        if (!isValidStudentIdx) {
           return res.send({       
            isSuccess: false,
            code: 410,
            message: "유효한 학생 인덱스가 아닙니다.",
           });
        }        
        
        const [rows] = await indexDao.updateStudents(connection, studentIdx, studentName, major, birth, address);     
         return res.send({       
          isSuccess: true,
          code: 200,
          message: "학생 수정 성공",
         });
      } catch (err) {
        logger.error(`updateStudents Query error\n: ${JSON.stringify(err)}`);
        return false;
      } finally {
        connection.release();
      }
    } catch (err) {
      logger.error(`updateStudents DB Connection error\n: ${JSON.stringify(err)}`);
      return false;
    }
}

//학생 생성
exports.createStudent = async function (req, res) {
  const { studentName, major, birth, address} = req.body;
console.log(typeof studentName);
  if (
    typeof studentName !== "string" ||
    typeof major !== "string" ||
    typeof address !== "string"
  ) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "문자값에 다른값을 넣을수 없습니다."
    });
  }
  
  var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  if(!regex.test(birth)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "날짜 형식을 확인해주세요.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.insertStudents(connection, studentName, major, birth, address);     
       return res.send({       
        isSuccess: true,
        code: 200,
        message: "학생 생성 성공",
       });
    } catch (err) {
      logger.error(`createStudents Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createStudents DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// 학생 테이블 조회
exports.readStudents = async function(req, res) {
    
  const { studentName } = req.query;
  console.log(studentName);
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        const [rows] = await indexDao.selectStudents(connection, studentName);     
         return res.send({
          result: rows,
          isSuccess: true,
          code: 200,
          message: "요청성공",
         });
      } catch (err) {
        logger.error(`readStudents Query error\n: ${JSON.stringify(err)}`);
        return false;
      } finally {
        connection.release();
      }
    } catch (err) {
      logger.error(`readStudents DB Connection error\n: ${JSON.stringify(err)}`);
      return false;
    }
}

// 예시 코드
exports.example = async function (req, res) {
  // return res.send("요청성공");
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.exampleDao(connection);     
       return res.send({
        result: rows,
        isSuccess: true,
        code: 200,
        message: "요청성공",
       });
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};