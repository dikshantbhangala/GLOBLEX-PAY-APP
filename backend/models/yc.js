const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true,
        unique: true,
    },
    status:{
        type:String,
        enum:['pending', 'submitted' , 'under_review','approved','rejected','expired'],
        default:'pending'
    },
    level: {
        type: String,
        enum: ['basic','intermediate' , 'advanced'],
        default: 'basic'
    },
     //Personal Information
     personalInfo:{
        firstName:{
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type : Date,
            required: true
        },
        nationality:{
            type: String,
            required: true
        },
        placeOfBirth: String,
        gender: {
            type: String,
            enum:['male','female','other','pefer_not_to_say']
        }
     }, 

     // Address Information
     address:{
        street:{
            type: String,
            required:true,
            trim: true
        },
        city:{
            type:String,
            required: true,
            trim: true
        },
        state:{
            type:String,
            required:true,
            trim: true
        },
        country:{
            type:String,
            required:true,
            trim:true
        },
        zipCode :{
            type: String,
            required: true,
            trim: true
        }
     },

     //Document Information
     documents:{
        govermentID:{
            type:{
                type:{
                    type: String,
                    enum:['passport', 'drivers_license' ,'national_id','voter_id'],
                    required: true
                },
                number:{
                    type:String,
                    required:true,
                    trim: true
                },
                expiryDate: Date,
                issueDate : Date,
                issuingCountry : String,
                images:{
                    Front:{
                        url:String,
                        publicId : String
                    },
                    back:{
                        url:String,
                        publicId:String
                    }
                }
            },
            proofOfAddress:{
                type:{
                    type:String,
                    enum:['utiltity_bill' ,'bank_statement' , 'lease_agreement' , 'goverment_letter']
                },
                images:{
                    Front:{
                        url:String,
                        publicId:String
                    }
                }
            },
            selfie:{
                url:String,
                publicId:String
            },
            additionalDocuments:[{
                type: String,
                description:String,
                url:String,
                publicId:String
            }]
        },
        employment:{
            status:{
                type:String,
                enum:['employed','self_employed','unemployed','student','retired']
            },
            employer:String,
            position:String,
            montlhyIncome:Number,
            sourceOfFunds:{
                type:String,
                enum:['salary','buisness','investments','inheritance','gift','other']
            }
        },
        //Verification results
        verification:{
            //Automated checks
            autmoated:{
                documentVerification:{
                    status:{
                        type:String,
                        enum:['pending', 'passed','failed'],
                        default:'pending'
                    },
                    confidence:Number,
                    extractedData: mongoose.Schema.Types.Mixed
                },
                faceMatch:{
                    status:{
                        type:String,
                        enum:['pending','passed','failed'],
                        default:'pending'
                    },
                    confidence: Number
                },
                addressVerification : {
                    status:{
                        type: String,
                        enum:['pending' ,'passed' ,'failed'],
                        default:'pending'
                    }
                }
            },
            //MAnual review
            manual:{
                reviewdBy:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Admin'
                },
                reviewDate : Date,
                notes : String,
                score : Number
            }
        },
        //Risk Assesment
        riskAssessment:{
            level:{
                type:String,
                enum:['low','medium' , 'high'],
                default:'medium'
            },
            factors:[String],
            score: Number,
            lastUpdated: Date
        },
        // Submission tracking
        submissionHistory:[{
            submittedAt : {
                type : Date,
                default: Date.now
            },
            status: String,
            documents : [String],
            rejectionReason : String
        }],
        //Approval / Rejection Details
        approvalDate : Date,
        rejectionDate : Date,
        rejectionReason : String,
        expiryDate: Date,

        flags:[{
            type:String,
            description : String,
            severity: {
                type: String,
                enum: ['low','medium','high','critical']
            },
            createdAt: {
                type:Date,
                default: Date.now
            }
        }]
     },
        timestamps:true,
        versionKey: false
     }
);

kycSchema.index({userId:1});
kycSchema.index({status:1});
kycSchema.index({level:1});
kycSchema.index({'documebts.govermentID.number':1});

// Virtual for days since submmission
kycSchema.virtual('daysSinceSubmission').get(function(){
    if(!this.submissionHistory.length) return 0;
    const lastSubmission = this.submissionHistory[this.submissionHistory.length -1];
    return Math.floor((Date.now() - lastSubmission.submittedAt) / (1000*60*60*24));
});

//Method to check if kyc is expired
kycSchema.methods.isExpired = function() {
  return this.expiryDate && this.expiryDate < new Date();
};

// Method to add submission
kycSchema.methods.addSubmission = function(documents, status = 'submitted') {
  this.submissionHistory.push({
    submittedAt: new Date(),
    status: status,
    documents: documents
  });
  this.status = status;
  return this;
};

module.exports = mongoose.model('KYC' ,kycSchema);