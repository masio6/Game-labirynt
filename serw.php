<?php
       if($_SERVER['REQUEST_METHOD'] == 'GET'){
		             
				$ścieżka ="top10.json";
                $dane = file_get_contents($ścieżka);
                        if(filesize($ścieżka)!= 0){
                                $dane =[$dane];
                                echo json_encode($dane);
                                exit();
                        }
						else{
                                echo '';
                                exit();
                        }       
                }           
              
	   if($_SERVER["REQUEST_METHOD"] == 'POST'){
                	 $zapisano=false;
				  $nazwapliku = "top10.json";
				$input = file_get_contents('php://input');              
                $D = fopen($nazwapliku,"w");             
                while(!$zapisano){
                        if(flock($D,LOCK_EX)){                                                         
						  $zapisano=true;
						  $ABC=json_decode($input,true);
						  $input=json_encode($ABC,JSON_PRETTY_PRINT);
						  fwrite($D,$input);
                          flock($D,LOCK_UN);
                        }
						else 
						{
                          sleep(1);
                        }
                }
                fclose($D);
                
              
        }
?>