const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let deleteID;
suite("Functional Tests", function () {
  suite("Routing Tests", () => {
    suite("3 Post request Test", () => {
      test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .post("/api/issues/project")
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
            created_by: "FCC",
            assigned_to: "Dom",
            status_text: "Not Done",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              deleteID = res.body._id;
              assert.equal(res.body.issue_title, "Issue");
              assert.equal(res.body.issue_text, "Functional Test");
              assert.equal(res.body.created_by, "FCC");
              assert.equal(res.body.assigned_to, "Dom"), assert.equal(res.body.status_text, "Not Done"), done();
            }
          });
      });

      test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .post("/api/issues/project")
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
            created_by: "FCC",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              deleteID = res.body._id;
              assert.equal(res.body.issue_title, "Issue");
              assert.equal(res.body.issue_text, "Functional Test");
              assert.equal(res.body.created_by, "FCC");
              done();
            }
          });
      });

      test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .post("/api/issues/project")
          .set("content-type", "application/json")
          .send({
            issue_title: "",
            issue_text: "",
            created_by: "",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, undefined);
              assert.equal(res.body.issue_text, undefined);
              assert.equal(res.body.created_by, undefined);
              done();
            }
          });
      });
    });

    suite("3 Get request Test", () => {
      test("View issues on a project: GET request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .get("/api/issues/apitest")
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.length, 16);
              done();
            }
          });
      });

      test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .get("/api/issues/apitest")
          .query({ assigned_to: "dom" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.length, 5);
              done();
            }
          });
      });

      test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .get("/api/issues/apitest")
          .query({ issue_title: "issue", created_by: "fcc" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.length, 10);
              done();
            }
          });
      });
    });

    suite("5 Put request Tests", () => {
      test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "623315f841f9a2cb9e1ef6c6",
            issue_title: "this is update field",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, "623315f841f9a2cb9e1ef6c6");
              assert.equal(res.body.result, "successfully updated");
              done();
            }
          });
      });

      test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "623315f841f9a2cb9e1ef6c6",
            issue_title: "this is updated title",
            issue_text: "this is updated text",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, "623315f841f9a2cb9e1ef6c6");
              assert.equal(res.body.result, "successfully updated");
              done();
            }
          });
      });

      test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .put("/api/issues/fcc-project")
          .send({
            _id: "",
            issue_title: "this is updated title",
            issue_text: "this is updated text",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, undefined);
              assert.equal(res.body.error, "missing _id");
              done();
            }
          });
      });

      test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "623315f841f9a2cb9e1ef6c6",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, "623315f841f9a2cb9e1ef6c6");
              assert.equal(res.body.error, "no update field(s) sent");
              done();
            }
          });
      });

      test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .put("/api/issues/fcc-project")
          .send({
            _id: "asdasd",
            issue_title: "test",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, "asdasd");
              assert.equal(res.body.error, "could not update");
              done();
            }
          });
      });
    });

    suite("3 Delete request Tests", () => {
      test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/project")
          .send({ _id: deleteID })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully deleted");
              done();
            }
          });
      });

      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/project")
          .send({ _id: "asdsa" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, "asdsa");
              assert.equal(res.body.error, "could not delete");
              done();
            }
          });
      });

      test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/project")
          .send({ _id: "" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, undefined);
              assert.equal(res.body.error, "missing _id");
              done();
            }
          });
      });
    });
  });
});
