package com.github.bartekbp;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.cursor.Cursor;

import java.util.List;

@Mapper
public interface DataMapper {
    List<Data> selectAll(@Param("limit") int limit);
    void insert(@Param("entity") Data data);
    int countAll();

    Cursor<Data> selectAllObs(int limit);
}
