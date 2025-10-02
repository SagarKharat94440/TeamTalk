package com.substring.chat.controller;

import com.substring.chat.model.Message;
import com.substring.chat.model.room;
import com.substring.chat.repositry.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class roomController {

    private RoomRepository roomRepository;

    public roomController(RoomRepository roomRepository){
        this.roomRepository=roomRepository;
    }

    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){

        if(roomRepository.findByRoomId(roomId)!= null){
            return  ResponseEntity.badRequest().body("Room is already created");
        }
        room room1= new room();
        room1.setRoomId(roomId);
        room savedRoom = roomRepository.save(room1);
        return ResponseEntity.status(HttpStatus.CREATED).body(room1);
    }

    // get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
         room room1= roomRepository.findByRoomId(roomId);

         if(room1==null){
             return ResponseEntity.badRequest().body("Room not found!");
         }

         return  ResponseEntity.ok(room1);
    }

    //get messages of room
    @GetMapping("/{roomId}/messages")
    public  ResponseEntity<List<Message>> getMessages(@PathVariable String  roomId,
                                                      @RequestParam(value = "page", defaultValue = "0", required = false) int page,
                                                      @RequestParam(value = "size", defaultValue = "20",required = false)int size
                                                      ){

        room room1= roomRepository.findByRoomId(roomId);
        if(room1==null){
            return  ResponseEntity.badRequest().build();
        }
        //get messages
        //pagination
        List<Message> messages = room1.getMessages();
        int start= Math.max(0, messages.size()-(page +1)*size);
        int end = Math.min( messages.size(), start+size);
        List<Message> paginatedMessages = messages.subList(start,end);
        return  ResponseEntity.ok(paginatedMessages);
    }
}
