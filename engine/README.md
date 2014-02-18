README.md

Available API:

"listAllBounces" 
"listGeneralBounces" 
"listNoEmailBounces" 
"listSuppressedBounces"
"listTransientGeneralBounces"
"listMailboxFullBounces"
"listMessageToolargeBounces"
"listContentRejectedBounces"
"listAttachmentRejectedBounces"
"listLastBounce"  - returns the last bounce notification saved
"dropBounceCollection" - Drops collection of bounce notifications
"Query" : {
				"type" : "",
				"criteria" : {}
			}

"listBouncesBetweenDates"
"Query" : {
				"type" : "listBouncesBetweenDates",
				"criteria" : {
				 "startDate" : "",
				 "endDate" : ""				
				}
			}


"listBouncesByRecipients"
"Query" : {
				"type" : "listBouncesByRecipients",
				"criteria" : {
					"recipients" : ["recipient1@example.com", "recipient2@example.com"]
				}
			}
  
