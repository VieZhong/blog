function updateDateList(dateArr,postDate){
	var date = postDate;
	var dateArr = dateArr.split(",");
	var dateArrlen = dateArr.length;
	var flag = true;
	while(dateArrlen>0){
		dateArrlen--;
		if(dateArr[dateArrlen] == date){
			flag = false;
			break;
		}
	}
	if( flag )
		dateArr.push(date);	
	return dateArr;
}

var dateArr = [];
{% for post in site.posts %}
	dateArr = updateDateList(dateArr.toString(),"{{ post.date | date: '%Y年%m月' }}");
{% endfor %}

for(var i=0;i<dateArr.length;i++){
	$("#dList").innerHTML += "<li><a href='{{site.baseurl}}'>"+dateArr[i]+"</a></li>";
}