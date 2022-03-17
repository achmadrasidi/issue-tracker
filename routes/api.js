"use strict";
require("dotenv").config();
const Issues = require("../model/issue.js");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      let issue = await Issues.find({ project });
      let { _id, assigned_to, status_text, open, issue_title, issue_text, created_by } = req.query;

      const filteredIssue = (issue, filter) => {
        return issue.filter((val) =>
          Object.keys(filter)
            .map((key) => val[key].toLowerCase().includes(filter[key].toLowerCase()))
            .reduce((a, b) => a && b, true)
        );
      };

      try {
        if (_id) {
          issue = issue.filter((val) => {
            return val._id.toString() === _id;
          });
        }

        if (assigned_to) {
          issue = filteredIssue(issue, { assigned_to });
        } else if (status_text) {
          issue = filteredIssue(issue, { status_text });
        }

        if (open) {
          if (open === "true") {
            issue = issue.filter((val) => val.open === true);
          } else if (open === "false") {
            issue = issue.filter((val) => val.open === false);
          } else {
            issue = [{ error: "invalid value" }];
          }
        }

        if (issue_title) {
          issue = filteredIssue(issue, { issue_title });
        }

        if (issue_text) {
          issue = filteredIssue(issue, { issue_text });
        }

        if (created_by) {
          issue = filteredIssue(issue, { created_by });
        }

        res.json(issue);
      } catch (error) {
        res.json({ error: "ERROR" });
      }
    })

    .post(async function (req, res) {
      const project = req.params.project;
      let { assigned_to, status_text, issue_title, issue_text, created_by } = req.body;
      let date = new Date();
      let obj = {
        project,
        assigned_to,
        status_text,
        open: true,
        issue_title,
        issue_text,
        created_by,
        created_on: date,
        updated_on: date,
      };

      try {
        const issue = await Issues.create(obj);
        let json = {
          assigned_to: issue.assigned_to,
          status_text: issue.status_text,
          open: true,
          _id: issue._id,
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_by: issue.created_by,
          created_on: date,
          updated_on: date,
        };

        if (!issue_title || !issue_text || !created_by) {
          res.json({ error: "required field(s) missing" });
        } else {
          res.json(json);
        }
      } catch (error) {
        res.json({ error: "ERROR" });
      }
    })

    .put(function (req, res) {
      const project = req.params.project;
      let { _id, assigned_to, status_text, open, issue_title, issue_text, created_by } = req.body;
      let date = new Date();
      let obj = {
        assigned_to,
        status_text,
        open,
        issue_title,
        issue_text,
        created_by,
        updated_on: date,
      };

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }

      if (!issue_title && !issue_text && !status_text && !assigned_to && !created_by && !open) {
        res.json({ error: "no update field(s) sent", _id });
        return;
      }

      Issues.findOneAndUpdate(
        { project, _id },
        {
          $set: obj,
        },
        (err, data) => {
          if (err || !data) {
            res.json({ error: "could not update", _id });
          } else {
            res.json({ result: "successfully updated", _id });
          }
        }
      );
    })

    .delete(function (req, res) {
      const project = req.params.project;
      const _id = req.body._id;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }
      Issues.findOneAndDelete({ project, _id }, (err, doc) => {
        if (err || !doc) {
          res.json({ error: "could not delete", _id });
        } else {
          res.json({ result: "successfully deleted", _id });
        }
      });
    });
};
