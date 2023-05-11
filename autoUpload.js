const { createFolder, uploadBasic } = require("./test");
const pool = require("./queries");
pool.connect();

const automate = async(userObj)=>{
    console.log("Automated Uploading Started");
 // creating application no and date
 let applicationNo = Math.floor(100000000 + Math.random() * 900000000);
 var str = "" + applicationNo;
 while (str.length < 10) {
   str = "0" + str;
 }
 applicationNo = parseInt(str);
 const date = new Date().toLocaleDateString();
 // console.log(date);

 // passing application no as folder name on google drive
 const folderId = await createFolder(applicationNo);
  let files = ['files/aboutme(1).txt','files/aboutme(2).txt','files/aboutme(3).txt','files/aboutme(4).txt','files/aboutme(5).txt','files/aboutme(6).txt','files/aboutme(7).txt'];
 let fileArr = [];
 for (let f = 0; f < files.length; f += 1) {
   fileArr.push(await uploadBasic(files[f], folderId));
 }
 console.log(fileArr);




  console.log("File pushed on google drive");

    // insert application data into the database
    pool.query(
        "INSERT INTO application VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *",
        [
          applicationNo,
          date,
          "Golu",
          "Mukesh",
          "22",
          "1-gha-27, jawahar nagar,jaipur,302004",
          "jain1011tanmay@gmail.com",
          "55555",
          "555422",
          "Titu",
          "CK Jain",
          "21",
          "pta nhi, udaipur,Raj,302005",
          "titu@gmail.com",
          "458585",
          "222222",
          fileArr,
          "{officer1}",
        ],
        (error, results) => {
          if (error) {
            throw error;
          }
          // res.render("application", { formOrStatus: 1 });
          formOrStatus = 1;
        }
      );
    // Inserting the application to the first level officer(officer1)
      pool.query(
        "update officers set applications = array_append(applications,$1) where designation=$2",
        [applicationNo, "officer1"],
        (error, results) => {
          if (error) {
            throw error;
          }
        }
      );

          // Inserting the application to the customer
    pool.query(
        "update customer set applicationno = array_append(applicationno,$1) where email=$2",
        [applicationNo, userObj.email],
        (error, results) => {
          if (error) {
            throw error;
          }
        }
      );

    }

module.exports = {automate};
