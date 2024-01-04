const chai = require("chai");
const chaiHttp = require("chai-http");
const {expect} = chai;
const {MongoMemoryServer} = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require("../app");

chai.use(chaiHttp);

before(async()=>{
        while(mongoose.connection.readyState >0){
            await mongoose.disconnect();
        }
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    after(async()=>{
        await mongoose.disconnect();
        await mongoServer.stop();
    });

let token;
describe("User API",()=>{

    it("Creates a new User",(done)=>{
        chai.request(app)
        .post('/api/auth/signup').send({username:"TestUser",password:"TestPassword"}).end((err,res)=>{
            expect(res).to.have.status(201);
            expect(res.text).to.equals("User created successfully!");
            done();
        });
    });

    it("Creating a new User with duplicate Username-Fails",(done)=>{
       chai.request(app)
        .post('/api/auth/signup').send({username:"TestUser",password:"TestPassword"}).end((err,res)=>{
            expect(res).to.have.status(400);
            expect(res.text).to.equals("Username already in use");
            done();
        });
    });

    it("Checking  User Login",(done)=>{
       chai.request(app)
        .post('/api/auth/login').send({username:"TestUser",password:"TestPassword"}).end((err,res)=>{
            expect(res).to.have.status(200);
            token = (res.text).slice(6);
            done();
        });
    });
    
});

describe("Notes API",()=>{
    let noteId;
    it("Creates a new Note-New Note1",(done)=>{
        chai.request(app)
        .post('/api/notes').send({title:"New Note1",description:"Note1 Description"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(201);
            expect(res.text).to.equals("Note Created Successfully");
            done();
        });
    });

    it("Creates a new Note-New Note2",(done)=>{
        chai.request(app)
        .post('/api/notes').send({title:"New Note2",description:"Note2 Description"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(201);
            expect(res.text).to.equals("Note Created Successfully");
            done();
        });
    });


    it("Get Notes",(done)=>{
        chai.request(app)
        .get('/api/notes').send({title:"New Note1",description:"Note1 Description"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            noteId = res.body[0]._id;
            done();
        });
    });


    it("Get Notes by id",(done)=>{
        chai.request(app)
        .get(`/api/notes/${noteId}`).send({title:"New Note1",description:"Note1 Description"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(200);
            expect(res.body.title).to.equals("New Note1");
            expect(res.body.description).to.equals("Note1 Description");
            done();
        });
    });

    it("Edit Notes by id",(done)=>{
        chai.request(app)
        .put(`/api/notes/${noteId}`).send({title:"New Note1",description:"Note1 Description Updated"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(200);
            expect(res.text).to.equals("Update Successful");
            done();
        });
    });

    it("Get Notes by id after put",(done)=>{
        chai.request(app)
        .get(`/api/notes/${noteId}`).send({title:"New Note1",description:"Note1 Description"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(200);
            expect(res.body.title).to.equals("New Note1");
            expect(res.body.description).to.equals("Note1 Description Updated");
            done();
        });
    });

    it("Query Search",(done)=>{
        chai.request(app)
        .get('/api/search?query='+"Note2").send({title:"New Note1",description:"Note1 Description"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            done();
        });
    });

    it("Deleting Note1",(done)=>{
        chai.request(app)
        .delete(`/api/notes/${noteId}`).send({title:"New Note1",description:"Note1 Description"})
        .set('authorization',`Bearer ${token}`).end((err,res)=>{
            expect(res).to.have.status(204);
            done();
        });
    });

})
