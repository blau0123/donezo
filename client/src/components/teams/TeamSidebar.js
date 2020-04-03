import React from "react";

import "./css/TeamSidebar.css";

import {Link} from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

class TeamSidebar extends React.Component{
    shortenTeamName = name => {
        if (name.length > 10) return name.substring(0, 11) + "...";
        return name;
    }   

    determineStyle = (currView, viewsId) => {
        return(
            {
                backgroundColor: parseInt(currView, 10) === viewsId ? "#A9BCD0" : "white",
                color: parseInt(currView, 10) === viewsId ? "#1C3144" : "#888888"
            }
        )
    }

    render(){
        const {currTeam, onChangeView, currView, teamsList, isUserInTeam} = this.props;

        const teamDropdownItems = teamsList && teamsList.length > 0 ?
            teamsList.map(team => {
                // need to check if the user is in a certain team or not
                const userIsInTeam = isUserInTeam(team);
                console.log(userIsInTeam ? team.teamName : "not in team")
                // if the user is in the team, show it and if not don't show the team
                return (userIsInTeam ? 
                        <Dropdown.Item key={team._id}>
                            <Link to={{
                                pathname: `/team/${team._id}`, 
                                state: {teamId: team._id}
                            }}>{this.shortenTeamName(team.teamName)}</Link>
                        </Dropdown.Item>
                    : null)
                
            }) : null;

        return(
            <div className="sidebar-container">
                <div className="team-select">
                    <Dropdown className="dropdown">
                        <Dropdown.Toggle variant='primary' id='team-selector' className='team-name-title'>
                            {
                                // decide if the user is on a team or if the user hasn't selected a team yet
                                teamsList.length > 0 ? this.shortenTeamName(currTeam.teamName) : "Select Team"
                            }
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {teamDropdownItems}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <h3 id={0} className="sidebar-text view-option" onClick={onChangeView}
                    style={this.determineStyle(currView, 0)}>Chat</h3>
                <h3 id={1} className="sidebar-text view-option" onClick={onChangeView}
                    style={this.determineStyle(currView, 1)}>Notes</h3>
                <h3 id={2} className="sidebar-text view-option" onClick={onChangeView}
                    style={this.determineStyle(currView, 2)}>Todos</h3>
                <h3 id={3} className="sidebar-text view-option" onClick={onChangeView}
                    style={this.determineStyle(currView, 3)}>Events</h3>
            </div>
        )
    }
}

export default TeamSidebar;