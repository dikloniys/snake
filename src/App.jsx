import React, { useState, useEffect } from "react";
import Snake from "./Components/Snake/Snake";
import Food from "./Components/Food/Food";
import Menu from "./Components/Menu/Menu";
import "./App.css";
import { useCallback } from "react";

const getRandomFood = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
};

const initialState = {
    food: getRandomFood(),
    direction: "RIGHT",
    speed: 100,
    route: "menu",
    snakeDots: [
        [0, 0],
        [0, 2],
    ],
};

const App = () => {
    const [state, setState] = useState(initialState);

    const gameOver = useCallback(
        () => {
          alert(`GAME OVER, your score is ${state.snakeDots.length - 2}`); 
      setState(initialState); 
        },
        [state.snakeDots.length],
      )

    const onSnakeCollapsed = useCallback(
        () => {
            let snake = [...state.snakeDots]; 
            let head = snake[snake.length - 1]; 
            snake.forEach((dot) => { 
                if (head[0] === dot[0] && head[1] === dot[1]) { 
                    gameOver(); 
                } 
            }); 
            },
        [gameOver, state.snakeDots],
        )
        const increaseSnake = useCallback(
            () => {
              const { snakeDots, food } = state;
              const newSnakeDots = [...snakeDots];
              newSnakeDots.unshift([...food]); 
              setState(prev =>{ 
                  prev.snakeDots = newSnakeDots
                  return prev
              }); 
            },
            [state],
          )

        const onSnakeEats = useCallback(
            () => {
            setState(prev =>{ 
                prev.food = getRandomFood()
                return prev
            }); 
            increaseSnake();  
            },
            [increaseSnake],
          )
              
    const onSnakeOut = useCallback(
        () => {
          let head = state.snakeDots[state.snakeDots.length - 1]; 
      if ( 
          head[0] >= 100 || 
          head[1] >= 100 || 
          head[0] < 0 || 
          head[1] < 0 
      ) { 
          gameOver()
      } 
        },
        [gameOver, state.snakeDots],
      )
      
	const moveSnake = useCallback(
	  () => {
		let dots = [...state.snakeDots];
        let head = dots[dots.length - 1];
        if (state.route === "game") {
            switch (state.direction) {
                case "RIGHT":
                    head = [head[0] + 2, head[1]];
                    break;
                case "LEFT":
                    head = [head[0] - 2, head[1]];
                    break;
                case "DOWN":
                    head = [head[0], head[1] + 2];
                    break;
                case "UP":
                    head = [head[0], head[1] - 2];
                    break;
				default:
					break;
            }
            onSnakeCollapsed()
            dots.push(head);
            dots.shift();
            setState(() =>( {
                ...state,
                snakeDots: dots,
            }));
            onSnakeOut()
        }
        if (head[0] === state.food[0] && head[1] === state.food[1]) { 
            onSnakeEats()
        }
	  },
	  [onSnakeCollapsed, onSnakeEats, onSnakeOut, state]
	)

    useEffect(() => {
        const interval = setInterval(moveSnake, state.speed);
        return () => clearInterval(interval);
    },[moveSnake, state.speed]);

	useEffect(() => {
		document.addEventListener("keydown",onKeyDown)
	
	  return () => {
		document.removeEventListener("keydown",onKeyDown)
	  }
	}, [])
	
    const onKeyDown = (e) => {

		switch (e.keyCode) { 
			case 65: 
				setState( prev => { 
					prev.direction = "LEFT"
					return prev
					} ); 
				break; 
			case 87: 
				setState( prev => { 
					prev.direction = "UP"
					return prev
					} ); 
				break; 
			case 68: 
				setState( prev =>  {
					prev.direction = "RIGHT"
					return prev
					} ); 
				break; 
			case 83: 
				setState( prev =>{
					 prev.direction = "DOWN"
					 return prev
					}); 
				break; 
			default:
				break;
		} 
    };

    const onRouteChange = () => {
        setState({
            ...state,
            route: "game",
        });
    };
   
    const { route, snakeDots, food } = state;

    return (
        <div>
            {route === "menu" ? (
                <div>
                    <Menu onRouteChange={onRouteChange} />
                </div>
            ) : (
                <div>
                    <div className="game-area">
                        <Snake snakeDots={snakeDots} />
                         <Food dot={food} /> 
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;