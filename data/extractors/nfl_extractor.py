import json
import os
from bs4 import BeautifulSoup as bs
import re
import requests

#CHANGE PARAMS FOR EXECUTION HERE
leagueID = "3311670"
league_name = "WatchYourMouthLeague"
season = "2015"
#END PARAMS

owners = {}
def getOwners(leagueID, season) :
	ownersSoup = getSoupFromPage(leagueID, season, 'owners')
	
	global owners
	ownersParsed = ownersSoup.find_all('tr', class_ = re.compile('team-'))
	for team in ownersParsed:
		teamId = team.attrs['class'][0].split('-')[1]
		owners[teamId] = {
			"id": teamId,
			"ownerName": team.find('td', class_ = 'teamOwnerName').text.strip(),
			"teamName": team.find('a', class_ = 'teamName').text.strip(),
			"teamLogo": team.find('a', class_ = 'teamImg').find("img").attrs['src'].strip(),
			"moves": team.find('td', class_ = 'teamTransactionCount').text.strip(),
			"trades": team.find('td', class_ = 'teamTradeCount').text.strip(),
		}
	
	with open('./' + league_name + "/" + str(season) + "/" + "owners.json", "w") as outfile:
		outfile.write(json.dumps(owners, indent=4, sort_keys=True))

	return owners

def getStandings(leagueId, season):
	with open('./' + league_name + "/" + str(season) + "/" + "regular_season.json", "w") as outfile:
		outfile.write(json.dumps(getStandingsRegular(leagueId, season), indent=4))
	with open('./' + league_name + "/" + str(season) + "/" + "playoffs.json", "w") as outfile:
		outfile.write(json.dumps(getStandingsPlayoffs(leagueId, season), indent=4))

def getStandingsRegular(leagueId, season):
	standingsRegularSoup = getSoupFromPage(leagueId, season, "standings?historyStandingsType=regular")
	standingRegularParsed = standingsRegularSoup.find_all('tr', class_ = re.compile('team-'))
	standings = []
	for team in standingRegularParsed:
		teamId = team.attrs['class'][0].split('-')[1]
		standings.append({
			"teamId": teamId,
			"rank": team.find('span', class_ = 'teamRank').text.strip(),
			"record": team.find('td', class_ = 'teamRecord').text.strip(),
			"pointsFor": float(team.findAll('td', class_ = 'teamPts')[0].text.strip().replace(",", "")),
			"pointsAgainst": float(team.findAll('td', class_ = 'teamPts')[1].text.strip().replace(",", "")),
		})
	return standings

def getStandingsPlayoffs(leagueId, season):
	standingsPlayoffsSoup = getSoupFromPage(leagueId, season, "standings?historyStandingsType=final")
	standingPlayoffsParsed = standingsPlayoffsSoup.find_all('li', class_ = re.compile('place-'))
	standings = []
	for team in standingPlayoffsParsed:
		standings.append({
			"teamId": team.find('a', class_ = 'teamName').attrs['class'][1].split("-")[1].strip(),
			"rank": team.attrs['class'][0].split('-')[1],
		})
	return standings

def getWeeks(leagueId, season):
	numWeeks = getNumWeeks(leagueId, season)
	for i in range(numWeeks):
		getWeek(leagueId, season, i+1)
		print(i)

def getNumWeeks(leagueId, season):
	gameCenterSoup = getSoupFromPage(leagueId, season, "teamgamecenter?teamId=1&week=1")
	weekNav = gameCenterSoup.find("ul", class_="weekNav")	
	lastWeekStr= weekNav.find("li", class_="last").attrs['class'][1].split("-")[1]
	return int(lastWeekStr)


def getWeek(leagueId, season, weekNum):
	if not os.path.isdir('./' + league_name + "/" + str(season) + "/" + str(weekNum)) :
		os.mkdir('./' + league_name + "/" + str(season) + "/" + str(weekNum))

	weekMatchUps = getWeekMatchups(leagueId, season, weekNum)
	for matchup in weekMatchUps:
		game = getGame(leagueId, season, weekNum, matchup)
		with open('./' + league_name + "/" + str(season) + "/" + str(weekNum) + "/"+ buildMatchupFilename(game)+".json", "w") as outfile:
			outfile.write(json.dumps(game, indent=4))

def buildMatchupFilename(matchup):
	global owners
	return owners[matchup['teamWinner']['teamId']]['teamName'] + " | " + str(matchup['teamWinner']['points']) + " XXX " + owners[matchup['teamLoser']['teamId']]['teamName'] + " | " + str(matchup['teamLoser']['points'])


def getWeekMatchups(leagueId, season, week):
	gameCenterSoup = getSoupFromPage(leagueId, season, "teamgamecenter?teamId=1&week="+str(week))
	matchupsNavbar = gameCenterSoup.find("div", id="teamMatchupNav").find("div", class_="teamNav").find("ul", class_="ss")
	matchups = matchupsNavbar.find_all("a")

	teamIds = []
	for matchup in matchups:
		teamIdString = re.search("teamId=(\d+)", matchup.attrs['href']).group()
		teamIds.append(int(teamIdString[7:]))
	return teamIds	


def getGame(leagueId, season, week, teamId):
	gameCenterSoup = getSoupFromPage(leagueId, season, "teamgamecenter?teamId="+str(teamId)+"&week="+str(week))
	matchup = {
		"week": week
	}

	team1 = getTeamInfoFromSoup(gameCenterSoup, 1)
	team2 = getTeamInfoFromSoup(gameCenterSoup, 2)
	
	if team1['points'] > team2['points']:
		matchup['teamWinner'] = team1
		matchup['teamLoser'] = team2
	else:
		matchup['teamWinner'] = team2
		matchup['teamLoser'] = team1

	return matchup

def getTeamInfoFromSoup(soup, teamIndex):
	teamElem = soup.find("div", class_="teamWrap-"+str(teamIndex))
	team = {
		"teamId": teamElem.find("a", class_="teamName").attrs['class'][1].split("-")[1],
		"points": float(teamElem.find("div", class_="teamTotal").text.strip()),
		"standings": teamElem.find("span", class_="teamRecord").text.strip(),
		"starters": getPlayersFromSoup(soup.find("div", id="tableWrap-"+str(teamIndex))),
		"bench": getPlayersFromSoup(soup.find("div", id="tableWrapBN-"+str(teamIndex)))
	}
	return team

def getPlayersFromSoup(soup):
	playersArr = []
	players = soup.find_all("tr", class_ = re.compile('player-'))
	for player in players:
		try:
			playersArr.append({
				"teamPosition": player.find("td", class_="teamPosition").find("span").text.strip(),
				"playerPosition": player.find("td", class_="playerNameAndInfo").find("em").text.strip().split(" - ")[0],
				"playerName": player.find("a", class_="playerName").text.strip(),
				"playerId": getPlayerId(player),
				"points": float(player.find("span", class_="playerTotal").text.strip()),
			})
		except Exception as e:
			print(e)
			playersArr.append({
				"teamPosition": player.find("td", class_="teamPosition").find("span").text.strip(),
				"playerPosition": None,
				"playerName": None,
				"playerId": None,
				"points": None,
			})

	return playersArr

playerIdRegex = re.compile("playerNameId-")
def getPlayerId(playerSoup):
	global playerIdRegex
	playerClasses = playerSoup.find("a", class_="playerName").attrs['class']
	playerIdClass = list(filter(playerIdRegex.match, playerClasses))
	playerId = playerIdClass[0].split("-")[1].strip()
	return playerId

def getDraft(leagueId, season):
	numRounds = getNumberRounds(leagueId, season)
	draft = {}

	for i in range(1, numRounds+1):
		draft[i] = getRound(leagueId, season, i)
	
	with open('./' + league_name + "/" + str(season) + "/" + "draft.json", "w") as outfile:
		outfile.write(json.dumps(draft, indent=4, sort_keys=True))

def getNumberRounds(leagueid, season):
	draftResultSoup = getSoupFromPage(leagueid, season, "draftresults")
	rounds = draftResultSoup.find("div", id="leagueDraftResultsResults").find("div", class_="byRound").find("div", class_="detailNav").find_all("li")
	return len(rounds)-1


def getRound(leagueId, season, roundNum):
	draftResultSoup = getSoupFromPage(leagueId, season, "draftresults?draftResultsDetail="+str(roundNum)+"&draftResultsTab=round&draftResultsType=results")
	round = {}

	picks= draftResultSoup.find("div", class_="results").find("div", class_="wrap").findChildren("ul" , recursive=False)[0].findChildren("li" , recursive=False)
	for index, pick in enumerate(picks):
		round[index+1] = {
			"round": roundNum,
			"pickRound": index+1,
			"pickOverall": int(pick.find("span", class_="count").text.strip(". ")),
			"playerName": pick.find("a", class_="playerName").text.strip(),
			"playerPosition": pick.find("a", class_="playerName").find_next("em").text.strip().split(" - ")[0],
			"playerId": getPlayerId(pick),
			"teamId": pick.find("a", class_="teamName").attrs['class'][1].split("-")[1]
		}
	return round



def getSoupFromPage(leagueId, season, page):
	url = 'https://fantasy.nfl.com/league/' + leagueId + "/history/" + season + "/" + page
	page = requests.get(url)
	html = page.text
	page.close()

	soup = bs(html, 'html.parser')
	return soup

if __name__ == "__main__":
	if not os.path.isdir('./' + league_name) :
		os.mkdir('./' + league_name)
	if not os.path.isdir('./' + league_name + "/" + season) :
		os.mkdir('./' + league_name + "/" + season)

	getOwners(leagueID, season)
	getDraft(leagueID, season)
	getWeeks(leagueID, season)
	getStandings(leagueID, season)
