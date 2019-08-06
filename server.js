
const {VKApi, ConsoleLogger, BotsLongPollUpdatesProvider} = require('node-vk-sdk')
var request = require("request"),
    cheerio = require("cheerio");



let api = new VKApi({
    token: '',
    logger: new ConsoleLogger()
})
var group_id = 168308422
let updatesProvider = new BotsLongPollUpdatesProvider(api, group_id)

var message_id;
var url = "http://soccer365.ru";

var load = function(table)
{	
	request(url, function (error, response, body) {
    if (!error) {
        let $ = cheerio.load(body);
        let tbd="Информация с soccer365.ru: \n\n";
        let buff = $(".block_body_nopadding").first().children('.game_block').each(function(index,val){   	
       	val = cheerio.load(val);
        let team1 = val(".game_ht>.game_team>span").text();
        let team2 = val(".game_at>.game_team>span").text();
        let team1_goals = val(".game_ht>.game_goals>span").text();
       	let team2_goals = val(".game_at>.game_goals>span").text();
       	let time;
       	if(val(".game_ht>.game_start>span").text()=="")
       	{
       		time =  val(".game_ht>.game_start").text();
       	}
       	else
       	{
       		time =  val(".game_ht>.game_start>span").text();
       	}
       	tbd = tbd + team1 + "\t" + team1_goals + " : " + team2_goals + "\t"+ team2 + "\n&#8986;" + time +"\n\n";
        });       
        table(tbd);
    } 	
    else {
        console.log("Произошла ошибка: " + error); 
          
    }

});
}

var key = 
{
    "one_time": false,
    "buttons": [
      [{
        "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Red"
        },
        "color": "negative"
      },
     {
        "action": {
          "type": "text",
          "payload": "{\"button\": \"2\"}",
          "label": "Green"
        },
        "color": "positive"
      }],
      [{
        "action": {
          "type": "text",
          "payload": "{\"button\": \"3\"}",
          "label": "White"
        },
        "color": "default"
      },
     {
        "action": {
          "type": "text",
          "payload": "{\"button\": \"4\"}",
          "label": "Blue"
        },
        "color": "primary"
      }]
    ]
  } ;
updatesProvider.getUpdates(updates => {
    
	if (!(Object.keys(updates).length === 0))
	{	
		
		let message = updates[0].object.body
		if (message == "Игры")
		{
			load(data => {
				api.messagesSend({user_id: updates[0].object.user_id, peer_id :message_id, message: data })
   				.then(response => {
        			message_id = response;
    			})
			});
		
		}
		else
		{
			
			api.messagesSend({user_id: updates[0].object.user_id, peer_id :message_id, message: "Отрпавь правильную комманду" })
   			.then(response => {
        	message_id = response;
    		})
		}			   		
	}
})




