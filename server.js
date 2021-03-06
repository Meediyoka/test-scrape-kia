var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
    // The URL we will scrape from

    url = 'https://arion.aut.ac.nz/ArionMain/CourseInfo/Information/Qualifications/PaperTable.aspx?id=3765';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
		
		links = [];
		 
		
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
			var $2 = cheerio.load(html);
			$2('a[class=Navigation]').each( (index, value) => {
			var link = $(value).attr('href');
			links.push(link);
			});


            // Finally, we'll define the variables we're going to capture

            var paper_code, paper_name, paper_points;
            var json = { paper_code : ""};
			items = [];
			
			 $('a[class=Navigation]').each(function(){
				 
				  // Let's store the data we filter into a variable so we can easily see what's going on.

                 var data = $(this);
				 
				 if(data.text() != null){

          
				
           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                paper_code = data.text();
				items.push(paper_code);
			

           // Once we have our title, we'll store it to the our json object.
		  
		   //TODO Seperate values into three types, code>name>points
				
                json.paper_code = items;
						
						}
					})
		
				}
		
				
				fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

				console.log('File successfully written! - Check your project directory for the output.json file');
				console.log(items);
				
		
			})
			
			fs.readFile('output.json', "utf8", function read(err, json_data) {
			if (err) {
			throw err;
			}
			
			
			console.log(json_data);
			content = [];
			content = json_data.split(',');
					
			console.log(content[1]);
			console.log(content[2]);
			
			count1 = 1;
			count2 = 2;
			
			console.log(links);
			
			urlBuilder = "https://arion.aut.ac.nz/ArionMain/CourseInfo/Information/Qualifications/"+links[2];
			console.log(urlBuilder);
			
			/*paired_paper_arr = [];
			for(i = 0; i < content.length; i++){
				paired_paper_arr.push(combined_paper);
				count1++;
				count2++;
				
			}
			
			console.log(paired_paper_arr);*/

			});
		
			// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
			res.send('Check your console!')
			})
		})



app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;